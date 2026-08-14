(() => {
  const content = {
    version: "Go 1.27",
    release: {
      en: "August 2026",
      ko: "2026년 8월",
    },
    cards: [
      {
        id: "uuid",
        tag: "STANDARD LIBRARY",
        size: "wide",
        featured: true,
        en: {
          title: "UUID, now in the standard library",
          body: "Generate and parse UUIDs with the new <code>uuid</code> package—no third-party dependency required.",
        },
        ko: {
          title: "표준 라이브러리 UUID",
          body: "새로운 <code>uuid</code> 패키지로 UUID를 생성하고 파싱해요. 이제 별도 서드파티 의존성이 필요 없어요.",
        },
      },
      {
        id: "generic-methods",
        tag: "LANGUAGE",
        size: "wide",
        en: {
          title: "Generic Methods",
          body: "Methods can declare their own type parameters, bringing generic APIs directly into a type’s namespace.",
        },
        ko: {
          title: "Generic Methods",
          body: "메서드가 자체 타입 파라미터를 선언할 수 있어요. 제네릭 API를 타입의 네임스페이스 안에 자연스럽게 구성해요.",
        },
      },
      {
        id: "small-allocations",
        tag: "PERFORMANCE",
        size: "wide",
        en: {
          title: "Up to 30% faster small allocations",
          body: "Size-specialized routines accelerate selected memory allocations smaller than 80 bytes.",
        },
        ko: {
          title: "소형 메모리 할당 최대 30% 향상",
          body: "크기별 특화 루틴이 80바이트 미만의 일부 메모리 할당을 더 빠르게 처리해요.",
        },
      },
      {
        id: "json-v2",
        tag: "STANDARD LIBRARY",
        en: {
          title: "encoding/json/v2",
          body: "A modern, option-driven JSON API with a new <code>jsontext</code> engine and significantly faster decoding.",
        },
        ko: {
          title: "encoding/json/v2",
          body: "새로운 <code>jsontext</code> 엔진과 옵션 기반 API로 더 현대적이고 빠른 JSON 디코딩을 제공해요.",
        },
      },
      {
        id: "goroutine-leak",
        tag: "OBSERVABILITY",
        en: {
          title: "Goroutine Leak Profiles",
          body: "The <code>goroutineleak</code> profile finds goroutines that can never be unblocked, directly through pprof.",
        },
        ko: {
          title: "고루틴 누수 프로파일",
          body: "절대 깨어날 수 없는 고루틴을 <code>goroutineleak</code> 프로파일로 pprof에서 바로 찾아요.",
        },
      },
      {
        id: "ml-kem",
        tag: "POST-QUANTUM CRYPTO",
        en: {
          title: "ML-KEM-1024 for TLS",
          body: "TLS adds ML-KEM-1024 key exchange support for stronger post-quantum security.",
        },
        ko: {
          title: "TLS용 ML-KEM-1024",
          body: "TLS가 ML-KEM-1024 키 교환을 지원해 더 강력한 양자 내성 암호화 선택지를 제공해요.",
        },
      },
      {
        id: "ml-dsa",
        tag: "POST-QUANTUM CRYPTO",
        en: {
          title: "ML-DSA Signatures",
          body: "The new <code>crypto/mldsa</code> package brings FIPS 204 signatures to X.509 and TLS 1.3.",
        },
        ko: {
          title: "ML-DSA 서명",
          body: "새로운 <code>crypto/mldsa</code> 패키지로 X.509와 TLS 1.3에서 FIPS 204 서명을 사용해요.",
        },
      },
      {
        id: "portable-simd",
        tag: "PERFORMANCE PREVIEW",
        en: {
          title: "Portable SIMD",
          body: "Portable SIMD scales across architectures and uses hardware acceleration when available.",
        },
        ko: {
          title: "Portable SIMD",
          body: "벡터 크기에 독립적인 SIMD API가 여러 아키텍처에서 가능한 하드웨어 가속을 활용해요.",
        },
      },
      {
        id: "generic-inference",
        tag: "LANGUAGE",
        en: {
          title: "Smarter Type Inference",
          body: "Generic functions infer type arguments when assigned to matching function types.",
        },
        ko: {
          title: "더 똑똑한 타입 추론",
          body: "제네릭 함수를 호환되는 함수 타입에 할당하거나 변환할 때 타입 인수를 자동으로 추론해요.",
        },
      },
      {
        id: "http",
        tag: "NETWORKING",
        size: "wide",
        en: {
          title: "Smarter HTTP connections",
          body: "HTTP/1 improves connection reuse, while HTTP/2 gains RFC 9218 client priority support.",
        },
        ko: {
          title: "더 스마트한 HTTP 연결",
          body: "HTTP/1 연결 재사용이 개선되고 HTTP/2는 RFC 9218 클라이언트 우선순위를 지원해요.",
        },
      },
      {
        id: "struct-selectors",
        tag: "LANGUAGE",
        en: {
          title: "Struct Field Selectors",
          body: "Struct literal keys can use valid field selectors for more expressive initialization.",
        },
        ko: {
          title: "구조체 필드 선택자",
          body: "구조체 리터럴의 키에 유효한 필드 선택자를 사용해 더 표현력 있게 초기화해요.",
        },
      },
      {
        id: "stdversion",
        tag: "DEVELOPER TOOLS",
        en: {
          title: "Built-in Version Guard",
          body: "<code>go test</code> catches standard-library APIs newer than the module’s declared Go version.",
        },
        ko: {
          title: "내장 버전 가드",
          body: "<code>go test</code>가 모듈의 Go 버전보다 새로운 표준 라이브러리 API 사용을 확인해요.",
        },
      },
      {
        id: "flate",
        tag: "PERFORMANCE",
        en: {
          title: "Faster DEFLATE",
          body: "<code>compress/flate</code> accelerates compression workloads across ZIP, Gzip, Zlib, and PNG.",
        },
        ko: {
          title: "더 빠른 DEFLATE",
          body: "<code>compress/flate</code>가 ZIP, Gzip, Zlib, PNG의 압축 작업을 더 빠르게 처리해요.",
        },
      },
      {
        id: "unicode",
        tag: "STANDARD LIBRARY",
        en: {
          title: "Unicode 17",
          body: "Unicode support advances from version 15 to 17 throughout the standard library.",
        },
        ko: {
          title: "Unicode 17",
          body: "표준 라이브러리 전반의 Unicode 지원이 버전 15에서 17로 업데이트됐어요.",
        },
      },
    ],
  };

  const language = document.documentElement.lang.toLowerCase().startsWith("ko")
    ? "ko"
    : "en";
  const grid = document.querySelector("[data-slide-grid]");
  const centerAfter = "generic-inference";

  const renderCenter = () => {
    const center = document.createElement("section");
    center.className = "spec-card center";
    center.dataset.cardId = "release";
    center.innerHTML = `
      <div class="go-text">${content.version}</div>
      <div class="release-text">${content.release[language]}</div>
    `;
    grid.append(center);
  };

  for (const card of content.cards) {
    const translation = card[language];
    const element = document.createElement("article");
    element.className = [
      "spec-card",
      card.size === "wide" ? "wide" : "",
      card.featured ? "featured" : "",
    ]
      .filter(Boolean)
      .join(" ");
    element.dataset.cardId = card.id;
    element.innerHTML = `
      <div class="eyebrow">${card.tag}</div>
      <h2 class="title">${translation.title}</h2>
      <p class="subtitle">${translation.body}</p>
    `;
    grid.append(element);

    if (card.id === centerAfter) {
      renderCenter();
    }
  }

  document.title = `${content.version} Overview`;
  window.__SLIDE_META__ = {
    language,
    cardIds: Array.from(grid.children, (element) => element.dataset.cardId),
    cardClasses: Array.from(grid.children, (element) => element.className),
  };

  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.dataset.ready = "true";
        window.__SLIDE_READY__ = true;
      });
    });
  });
})();
