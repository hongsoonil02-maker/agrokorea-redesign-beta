(function () {
  "use strict";

  var STORES = [
    {
      key: "rotagal",
      name: "ROTAGAL® 로타갈",
      desc: { ko: "임신우 원샷 접종으로 송아지 설사병 3중 예방하는 EU GMP 백신", en: "EU GMP one-shot vaccine preventing calf diarrhea" },
      accent: "#d95d39",
      naver: "https://smartstore.naver.com/petschury/profile",
      coupang: "",
      site: "https://rotagal.kr"
    },
    {
      key: "vetacol",
      name: "VETACOL 베타콜",
      desc: { ko: "출생 직후 골든타임을 채우는 초유 면역 영양제 · 15ml 시린지", en: "Colostrum immune nutrition for newborns · 15 ml syringe" },
      accent: "#dfa32b",
      naver: "https://smartstore.naver.com/petschury/profile",
      coupang: "",
      site: "https://vetacol.kr"
    },
    {
      key: "parvogel",
      name: "PARVOGEL 파보겔",
      desc: { ko: "모든 동물 신생아 설사 케어 나노 몬모릴로나이트 보조제", en: "Nano montmorillonite anti-diarrheal support for newborns" },
      accent: "#7a5fc0",
      naver: "https://smartstore.naver.com/petschury/profile",
      coupang: "",
      site: "https://parvogel.kr"
    },
    {
      key: "monsmecta",
      name: "MONSMECTA 몬스멕타",
      desc: { ko: "수의사 전용 장 점막 보호 솔루션 (온라인 판매 제외)", en: "Veterinarian-exclusive mucosal protection solution" },
      accent: "#2e8f81",
      naver: "",
      coupang: "",
      site: "https://monsmecta.kr",
      vetOnly: true
    }
  ];

  var MALLS = {
    naver: {
      ko: "네이버 스마트스토어",
      en: "Naver Smart Store",
      dot: "#03c75a",
      search: "https://smartstore.naver.com/search?keyword="
    },
    coupang: {
      ko: "쿠팡",
      en: "Coupang",
      dot: "#ae2b2b",
      search: "https://www.coupang.com/np/search?q="
    }
  };

  var lang = (document.documentElement.lang || "ko").toLowerCase().indexOf("en") === 0 ? "en" : "ko";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buyButtons(product) {
    var html = "";
    ["naver", "coupang"].forEach(function (mall) {
      var url = product[mall];
      if (!url) { return; }
      html += '<a class="buy-btn" target="_blank" rel="noopener" href="' + esc(url) + '">' +
        '<i class="dot" style="background:' + MALLS[mall].dot + '"></i>' + esc(MALLS[mall][lang] || mall) + "</a>";
    });
    return html;
  }

  function renderBuyBoxes() {
    var boxes = document.querySelectorAll(".buy-box[data-product]");
    Array.prototype.forEach.call(boxes, function (box) {
      var key = box.getAttribute("data-product");
      var product = null;
      STORES.some(function (p) { if (p.key === key) { product = p; return true; } return false; });
      if (!product) { return; }
      var parts = buyButtons(product);
      if (!parts.length) { return; }
      box.innerHTML = '<span class="buy-box-title">' + (lang === "ko" ? "공식 온라인 구매처" : "Official online stores") + "</span>" + parts;
    });
  }

  function renderStoreStrip() {
    var strip = document.querySelector("[data-store-strip]");
    if (!strip) { return; }
    var cards = "";
    STORES.forEach(function (p) {
      var links = buyButtons(p);
      var siteLink = '<a class="buy-btn" target="_blank" rel="noopener" href="' + esc(p.site) + '">' +
        '<i class="dot" style="background:' + esc(p.accent) + '"></i>' +
        (lang === "ko" ? "브랜드 공식 사이트" : "Brand official site") + "</a>";
      cards +=
        '<article class="store-card">' +
        '<span class="sc-brand"><i style="background:' + esc(p.accent) + '"></i>AgroKorea Official</span>' +
        "<h3>" + esc(p.name) + "</h3>" +
        "<p>" + esc(p.desc[lang]) + "</p>" +
        '<div class="sc-links">' + (links || siteLink) + "</div>" +
        "</article>";
    });
    if (!cards) { return; }
    strip.innerHTML = cards;
    var section = strip.closest("section[hidden]");
    if (section) { section.removeAttribute("hidden"); }
    if ("IntersectionObserver" in window) {
      Array.prototype.forEach.call(strip.querySelectorAll(".reveal"), function (el) { el.classList.add("in"); });
      var head = section && section.querySelector(".section-head.reveal");
      if (head) { head.classList.add("in"); }
      var note = section && section.querySelector("[data-store-note]");
      if (note && note.classList.contains("reveal")) { note.classList.add("in"); }
    }
  }

  renderBuyBoxes();
  renderStoreStrip();
})();
