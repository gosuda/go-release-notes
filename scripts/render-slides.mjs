import { createServer } from "node:http";
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requestedTargets = process.argv.slice(2);
const renderScale = Number(process.env.PNG_SCALE ?? 3);
if (!Number.isInteger(renderScale) || renderScale < 1 || renderScale > 4) {
  throw new Error("PNG_SCALE must be an integer from 1 to 4");
}

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".woff2", "font/woff2"],
]);

async function discoverSlides(targets) {
  const inputs = targets.length
    ? targets
    : (await readdir(projectRoot, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory() && /^go\d+\.\d+$/.test(entry.name))
        .map((entry) => entry.name);
  const slides = [];

  for (const input of inputs) {
    const absolute = resolve(projectRoot, input);
    if (!absolute.startsWith(`${projectRoot}${sep}`)) {
      throw new Error(`Target escapes the project root: ${input}`);
    }

    const details = await stat(absolute);
    if (details.isFile()) {
      if (extname(absolute) !== ".html") {
        throw new Error(`Expected an HTML file: ${input}`);
      }
      slides.push(absolute);
      continue;
    }

    const files = await readdir(absolute, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && /^overview(?:-[a-z]+)?\.html$/.test(file.name)) {
        slides.push(resolve(absolute, file.name));
      }
    }
  }

  return slides.sort();
}

function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url ?? "/", "http://127.0.0.1").pathname,
      );
      const filePath = resolve(projectRoot, `.${pathname}`);
      if (filePath !== projectRoot && !filePath.startsWith(`${projectRoot}${sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }

      const body = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": mimeTypes.get(extname(filePath)) ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(body);
    } catch (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
    }
  });

  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not determine the render server address"));
        return;
      }
      resolveServer({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

function comparableLayout(audit) {
  return {
    page: audit.page,
    cards: audit.cards.map(({ id, className, rect }) => ({ id, className, rect })),
  };
}

function assertTranslationParity(audits) {
  const groups = new Map();
  for (const audit of audits) {
    const directory = dirname(audit.file);
    const group = groups.get(directory) ?? [];
    group.push(audit);
    groups.set(directory, group);
  }

  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const baseline = comparableLayout(group[0]);
    for (const candidate of group.slice(1)) {
      if (JSON.stringify(comparableLayout(candidate)) !== JSON.stringify(baseline)) {
        throw new Error(
          `Translation layout mismatch: ${relative(projectRoot, group[0].file)} and ${relative(projectRoot, candidate.file)}`,
        );
      }
    }
  }
}

const slideFiles = await discoverSlides(requestedTargets);
if (slideFiles.length === 0) {
  throw new Error("No overview HTML files found");
}

const { server, origin } = await startStaticServer();
const browser = await chromium.launch({ headless: true });
const audits = [];

try {
  for (const file of slideFiles) {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 900 },
      deviceScaleFactor: renderScale,
    });
    const browserErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("requestfailed", (request) => {
      browserErrors.push(`${request.url()}: ${request.failure()?.errorText ?? "request failed"}`);
    });

    const relativeFile = relative(projectRoot, file).split(sep).join("/");
    await page.goto(`${origin}/${relativeFile}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__SLIDE_READY__ === true);

    const audit = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll(".spec-card"), (card) => {
        const rect = card.getBoundingClientRect();
        return {
          id: card.dataset.cardId,
          className: card.className,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          overflows:
            card.scrollHeight > card.clientHeight + 1 ||
            card.scrollWidth > card.clientWidth + 1,
        };
      });

      return {
        meta: window.__SLIDE_META__,
        fontLoaded: document.fonts.check('16px "Pretendard Variable"'),
        page: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        cards,
      };
    });

    if (browserErrors.length) {
      throw new Error(`${relativeFile}: ${browserErrors.join("; ")}`);
    }
    if (!audit.fontLoaded) {
      throw new Error(`${relativeFile}: Pretendard Variable did not load`);
    }
    const overflowing = audit.cards.filter((card) => card.overflows);
    if (overflowing.length) {
      throw new Error(
        `${relativeFile}: overflowing cards: ${overflowing.map((card) => card.id).join(", ")}`,
      );
    }
    if (audit.cards.length !== audit.meta.cardIds.length) {
      throw new Error(`${relativeFile}: rendered card metadata is incomplete`);
    }

    const output = file.replace(/\.html$/, ".png");
    await page.screenshot({
      path: output,
      fullPage: true,
      animations: "disabled",
      caret: "hide",
    });
    audits.push({ ...audit, file });
    console.log(
      `Rendered ${relativeFile} -> ${relative(projectRoot, output)} (${audit.page.width * renderScale}x${audit.page.height * renderScale}, ${renderScale}x)`,
    );
    await page.close();
  }

  assertTranslationParity(audits);
  console.log(`Verified translation parity for ${audits.length} slide(s).`);
} finally {
  await browser.close();
  await new Promise((resolveClose, reject) => {
    server.close((error) => (error ? reject(error) : resolveClose()));
  });
}
