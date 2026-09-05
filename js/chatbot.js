(function () {
  "use strict";

  var TEL = "02-6949-5708";
  var TEL_INTL = "+82-2-6949-5708";
  var EMAIL = "name_hyosun@naver.com";

  function detectCurrentLang() {
    var match = document.cookie.match(/(?:^|;\s*)googtrans=\/([^\/]+)\/([^\/;]+)/);
    if (match && match[2]) {
      var code = match[2].toLowerCase();
      if (code.indexOf("en") === 0) return "en";
      if (code !== "ko") return "en"; // Global non-korean fallback to EN for high quality response
    }
    return (document.documentElement.lang || "ko").toLowerCase().indexOf("en") === 0 ? "en" : "ko";
  }

  var lang = detectCurrentLang();
  var inProducts = /products\/[a-z]+\.html$/i.test(location.pathname);

  function pl(name) { return (inProducts ? "" : "products/") + name + ".html"; }

  var TEXT = {
    ko: {
      title: "AGRO 어시스턴트",
      status: "온라인",
      greeting: "안녕하세요! <b>㈜한국아그로</b> 전문 상담 챗봇입니다.<br/>로타갈·베타콜·파보겔·몬스멕타 및 수의사 병원 공급 문의를 입력해 주세요.",
      placeholder: "궁금한 내용을 입력하세요…",
      send: "보내기",
      openLabel: "상담 챗봇 열기",
      chips: ["몬스멕타 성분 및 병원 공급", "로타갈 백신 특징", "베타콜 초유 급여법", "공급 및 단가 문의"],
      fallback: "죄송해요, 그 부분은 제가 바로 답변드리기 어렵네요. <a href=\"tel:" + TEL + "\">" + TEL + "</a> (해외: <a href=\"tel:" + TEL_INTL + "\">" + TEL_INTL + "</a>) 또는 <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>으로 문의주시면 즉시 전문 상담사가 안내해 드립니다.",
      disclaimer: "동물용 의약품 및 처방 보조제의 사용은 반드시 면허를 갖춘 수의사의 지도에 따라 주세요."
    },
    en: {
      title: "AGRO Assistant",
      status: "Online",
      greeting: "Hello! Welcome to <b>Korea Agro Co., Ltd.</b><br/>Inquire about our veterinary portfolio: MONSMECTA, ROTAGAL, VETACOL, PARVOGEL or hospital supply terms.",
      placeholder: "Type your inquiry…",
      send: "Send",
      openLabel: "Open chat assistant",
      chips: ["MONSMECTA Specifications", "ROTAGAL Vaccine", "VETACOL Colostrum", "Hospital Supply & Wholesale"],
      fallback: "Sorry, I can't answer that directly. Please contact our clinical desk at <a href=\"tel:" + TEL_INTL + "\">" + TEL_INTL + "</a> or <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a> for verified wholesale and registration dossiers.",
      disclaimer: "Veterinary medicines and prescription supplements must be administered under licensed veterinary guidance."
    }
  };

  function a(href, label) { return '<a href="' + href + '">' + label + "</a>"; }

  var INTENTS = [
    {
      kw: ["로타갈", "rotagal", "백신", "vaccine"],
      ko: "<b>ROTAGAL®(로타갈)</b>은 임신우 분만 전 단 1회(원샷) 접종으로 소 로타바이러스·코로나바이러스·대장균(K99)에 의한 송아지 설사병을 예방하는 EU GMP 프리미엄 백신입니다. 유럽 Pharmagal사 직수입 제품으로 독일·영국·호주 등 40여 개국에 수출 중입니다.<br/><br/>자세히: " + a(pl("rotagal"), "ROTAGAL 제품 페이지") + " · " + a("https://rotagal.kr", "rotagal.kr"),
      en: "<b>ROTAGAL®</b> is an EU GMP premium vaccine imported from Pharmagal (Slovakia). A single shot of pregnant cows before calving protects calves against rotavirus, coronavirus and E. coli K99 diarrhea — exported to over 40 countries.<br/><br/>More: " + a(pl("rotagal"), "ROTAGAL page") + " · " + a("https://rotagal.kr", "rotagal.kr")
    },
    {
      kw: ["베타콜", "vetacol", "초유", "colostrum"],
      ko: "<b>VETACOL(베타콜)</b>은 출생 직후 송아지 생존 골든타임을 채우는 초유·유청·바실러스·MCT·비타민 5대 복합 면역 영양제입니다. 15ml 시린지로 간편하게 급여할 수 있어요.<br/><br/>자세히: " + a(pl("vetacol"), "VETACOL 제품 페이지"),
      en: "<b>VETACOL</b> is a 5-in-1 immune nutrition formula (colostrum, whey, Bacillus, MCT, vitamins) for calves right after birth, fed easily with a 15 ml syringe.<br/><br/>More: " + a(pl("vetacol"), "VETACOL page")
    },
    {
      kw: ["파보겔", "parvogel"],
      ko: "<b>PARVOGEL(파보겔)</b>은 송아지·돼지·염소·양·망아지 등 모든 동물 신생아의 설사 치료를 돕는 고순도 나노 몬모릴로나이트 + 바실러스 서브틸리스 보조제입니다.<br/><br/>자세히: " + a(pl("parvogel"), "PARVOGEL 제품 페이지"),
      en: "<b>PARVOGEL</b> supports anti-diarrheal care for newborns of all species (calves, piglets, lambs, foals) with ultra-fine nano montmorillonite plus Bacillus subtilis.<br/><br/>More: " + a(pl("parvogel"), "PARVOGEL page")
    },
    {
      kw: ["몬스멕타", "monsmecta", "스멕타", "smecta", "장점막", "처방", "동물병원"],
      ko: "<b>MONSMECTA(몬스멕타)</b>는 동물병원 전용으로 공급되는 <b>장 점막 보호 및 장독소 흡착 솔루션(100ml)</b>입니다.<br/>• <b>5대 복합체</b>: 고순도 초미세 나노 몬모릴로나이트, 특허 균주 <i>Bacillus subtilis</i> MORI(DNJ 함유, 특허 201180042602.8), 비타민A, 전해질염(Sodium acetate/propionate), 포도당.<br/>• <b>공급 방식</b>: 일반 쇼핑몰 판매가 아닌 수의사 면허 확인 후 병원 직발송 방식으로 공급됩니다.<br/><br/>자세히: " + a(pl("monsmecta"), "MONSMECTA 제품 상세 보기") + " · " + a("https://monsmecta.kr", "monsmecta.kr 공식 사이트"),
      en: "<b>MONSMECTA</b> is a premium veterinarian-exclusive <b>intestinal mucosal protection & enterotoxin adsorption solution (100ml)</b>.<br/>• <b>5-Complex Formula</b>: Ultra-fine nano montmorillonite, patented <i>Bacillus subtilis</i> MORI (Patent No. 201180042602.8 with natural DNJ), Vitamin A, electrolytes (sodium acetate/propionate), and dextrose.<br/>• <b>Distribution</b>: Distributed exclusively to verified veterinary clinics and hospitals.<br/><br/>More: " + a(pl("monsmecta"), "MONSMECTA Details") + " · " + a("https://monsmecta.kr", "monsmecta.kr Official Site")
    },
    {
      kw: ["구매", "구입", "주문", "스마트스토어", "네이버", "쿠팡", "가격", "얼마", "buy", "order", "price", "coupang", "naver", "store", "shop"],
      ko: "베타콜과 파보겔은 <b>네이버 스마트스토어·쿠팡 공식 입점 몰</b> 및 브랜드 사이트에서 구매 가능합니다.<br/>※ <b>몬스멕타</b>와 <b>로타갈 백신</b>은 동물병원 및 수의사 전용 품목이므로 전화(<a href=\"tel:" + TEL + "\">" + TEL + "</a>) 또는 이메일 상담을 통해 병원 공급 단가를 안내해 드립니다.<br/><br/>" + a("#store", "온라인 스토어 바로가기") + " · " + a("tel:" + TEL, "도입 문의 " + TEL),
      en: "VETACOL and PARVOGEL are available via official <b>Naver Smart Store & Coupang storefronts</b>.<br/>※ <b>MONSMECTA</b> and <b>ROTAGAL vaccine</b> are strictly veterinarian-exclusive. Contact our clinical desk at <a href=\"tel:" + TEL_INTL + "\">" + TEL_INTL + "</a> or <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a> for wholesale pricing.<br/><br/>" + a("#store", "Online Storefronts") + " · " + a("tel:" + TEL_INTL, "Call " + TEL_INTL)
    },
    {
      kw: ["재고", "유통기한", "납기", "배송", "delivery", "shipping", "stock", "inventory"],
      ko: "재고와 납기는 문의 건별로 확인해 드리고 있습니다. <a href=\"tel:" + TEL + "\">" + TEL + "</a> 또는 <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>로 필요한 품목과 수량을 알려주시면 당일 안내해 드립니다.",
      en: "Stock and lead times are confirmed per inquiry. Tell us the items and quantities at <a href=\"tel:" + TEL_INTL + "\">" + TEL_INTL + "</a> or <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a> and we will respond same-day."
    },
    {
      kw: ["접종", "시기", "용법", "복용", "사용법", "dosage", "how to use", "when", "timing", "dose", "접종시기"],
      ko: "<b>로타갈</b>은 임신우 분만 전 단 1회 접종이며, 초유를 통해 송아지에게 이동 항체가 전달됩니다. 상세 접종 프로토콜은 허가 자료와 수의사 지도 기준입니다. " + TEXT.ko.disclaimer + "<br/><br/>" + a(pl("rotagal"), "ROTAGAL 접종 정보 보기"),
      en: "<b>ROTAGAL</b> is given as a single dose to pregnant cows before calving; antibodies pass to calves via colostrum. Detailed protocols follow the approved label and veterinary guidance. " + TEXT.en.disclaimer + "<br/><br/>" + a(pl("rotagal"), "See ROTAGAL details")
    },
    {
      kw: ["회사", "주소", "위치", "연락처", "전화", "이메일", "contact", "address", "phone", "email", "company", "location"],
      ko: "<b>㈜한국아그로</b><br/>주소: 서울특별시 마포구 큰우물로 75, 성지빌딩 1506호<br/>TEL: <a href=\"tel:" + TEL + "\">" + TEL + "</a> / FAX: 02-6949-5709<br/>E-mail: <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>",
      en: "<b>Korea Agro Co., Ltd.</b><br/>Address: #1506, Sungji Building, 75 Keunumul-ro, Mapo-gu, Seoul, Korea<br/>TEL: <a href=\"tel:" + TEL_INTL + "\">" + TEL_INTL + "</a><br/>E-mail: <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>"
    },
    {
      kw: ["수출", "파트너", "제휴", "협력", "해외", "export", "partner", "partnership", "global", "distributor", "대리점"],
      ko: "한국아그로는 중국·유럽·뉴질랜드·대만 등 글로벌 파트너 8개 사와 협력하며, 로타갈은 40여 개국에 수출되고 있습니다. 해외 파트너십·수입 문의는 <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>으로 연락 주세요. 영문 사이트: <a href=\"en/index.html\">agrokorea.net/en</a>",
      en: "Korea Agro works with 8 global partners across China, Europe, New Zealand and Taiwan, and ROTAGAL is exported to 40+ countries. For partnership or import inquiries, email <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>."
    },
    {
      kw: ["안녕", "하이", "hello", "hi", "hey", "감사", "thanks"],
      ko: "안녕하세요! 무엇을 도와드릴까요? 제품명(로타갈·베타콜·파보겔·몬스멕타)이나 '구매', '연락처' 등을 입력해 보세요.",
      en: "Hello! How can I help you? Try a brand name (ROTAGAL, VETACOL, PARVOGEL, MONSMECTA) or keywords like \"buy\" or \"contact\"."
    }
  ];

  var t = TEXT[lang];

  function normalize(s) {
    return String(s).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function localReply(message) {
    var msg = normalize(message);
    if (!msg) { return null; }
    var best = null;
    var bestScore = 0;
    INTENTS.forEach(function (intent) {
      var score = 0;
      intent.kw.forEach(function (k) {
        if (msg.indexOf(normalize(k)) !== -1) { score += k.length > 2 ? 2 : 1; }
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    if (!best) { return t.fallback; }
    return best[lang];
  }

  function getReply(message, done) {
    if (window.AGRO_CHAT_ENDPOINT) {
      try {
        fetch(window.AGRO_CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message, lang: lang })
        })
          .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(String(r.status))); })
          .then(function (data) { done((data && data.reply) || localReply(message)); })
          .catch(function () { done(localReply(message)); });
        return;
      } catch (e) {}
    }
    done(localReply(message));
  }

  var ICON_CHAT = '<svg class="chat-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_BOT = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4m-4 10h.01M16 14h.01M9 17h6"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';

  var panel =
    '<button type="button" class="chat-fab" id="chatFab" aria-label="' + t.openLabel + '" aria-expanded="false">' +
    ICON_CHAT +
    '<span class="chat-fab-close">' + ICON_CLOSE + "</span>" +
    "</button>" +
    '<div class="chat-panel" id="chatPanel" role="dialog" aria-modal="false" aria-label="' + t.title + '">' +
    '<div class="chat-head">' +
    '<span class="chat-avatar">' + ICON_BOT + '</span>' +
    '<div><b>' + t.title + "</b><span>" + (lang === "ko" ? "㈜한국아그로" : "Korea Agro Co., Ltd.") + "</span></div>" +
    '<span class="chat-status">' + t.status + "</span>" +
    "</div>" +
    '<div class="chat-body" id="chatBody" aria-live="polite"></div>' +
    '<div class="chip-row" id="chipRow"></div>' +
    '<form class="chat-input-row" id="chatForm">' +
    '<input type="text" id="chatInput" autocomplete="off" placeholder="' + t.placeholder + '" aria-label="' + t.placeholder + '" />' +
    '<button type="submit" class="chat-send" aria-label="' + t.send + '">' + ICON_SEND + "</button>" +
    "</form></div>";

  document.body.insertAdjacentHTML("beforeend", panel);

  var fab = document.getElementById("chatFab");
  var panelEl = document.getElementById("chatPanel");
  var bodyEl = document.getElementById("chatBody");
  var chipRow = document.getElementById("chipRow");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");

  function addMsg(html, who) {
    var div = document.createElement("div");
    div.className = "msg " + who;
    div.innerHTML = html;
    bodyEl.appendChild(div);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return div;
  }

  function addChips() {
    chipRow.innerHTML = "";
    t.chips.forEach(function (label) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = label;
      b.addEventListener("click", function () {
        ask(label);
      });
      chipRow.appendChild(b);
    });
  }

  function ask(text) {
    addMsg(String(text).replace(/</g, "&lt;"), "user");
    input.value = "";
    var pending = addMsg("···", "bot");
    window.setTimeout(function () {
      getReply(text, function (reply) {
        pending.innerHTML = reply;
        bodyEl.scrollTop = bodyEl.scrollHeight;
      });
    }, 420);
  }

  function refreshChatText() {
    lang = detectCurrentLang();
    t = TEXT[lang] || TEXT.ko;
    var titleEl = panelEl.querySelector(".chat-head b");
    var subEl = panelEl.querySelector(".chat-head span:not(.chat-status)");
    var statusEl = panelEl.querySelector(".chat-status");
    if (titleEl) titleEl.textContent = t.title;
    if (subEl) subEl.textContent = (lang === "ko" ? "㈜한국아그로" : "Korea Agro Co., Ltd.");
    if (statusEl) statusEl.textContent = t.status;
    if (input) {
      input.placeholder = t.placeholder;
      input.setAttribute("aria-label", t.placeholder);
    }
  }

  function setOpen(openState) {
    document.body.classList.toggle("chat-open", openState);
    fab.setAttribute("aria-expanded", openState ? "true" : "false");
    refreshChatText();
    if (openState && !bodyEl.childElementCount) {
      addMsg(t.greeting, "bot");
      addChips();
    }
    if (openState) { input.focus(); }
  }

  window.addEventListener("agroLanguageChanged", function () {
    refreshChatText();
    if (document.body.classList.contains("chat-open") && bodyEl.childElementCount <= 2) {
      bodyEl.innerHTML = "";
      addMsg(t.greeting, "bot");
      addChips();
    }
  });

  fab.addEventListener("click", function () {
    setOpen(!document.body.classList.contains("chat-open"));
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (v) { ask(v); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("chat-open")) {
      setOpen(false);
    }
  });

  window.AGRO_CHAT = { ask: ask, localReply: localReply, refreshChatText: refreshChatText };
})();
