(function () {
  "use strict";

  var TEL = "02-6949-5708";
  var TEL_INTL = "+82-2-6949-5708";
  var EMAIL = "name_hyosun@naver.com";

  var lang = (document.documentElement.lang || "ko").toLowerCase().indexOf("en") === 0 ? "en" : "ko";
  var inProducts = /products\/[a-z]+\.html$/i.test(location.pathname);

  function pl(name) { return (inProducts ? "" : "products/") + name + ".html"; }

  var TEXT = {
    ko: {
      title: "AGRO 어시스턴트",
      status: "온라인",
      greeting: "안녕하세요! <b>㈜한국아그로</b> 상담 챗봇입니다.<br/>제품·도입·구매 문의를 입력해 주세요.",
      placeholder: "궁금한 내용을 입력하세요…",
      send: "보내기",
      openLabel: "상담 챗봇 열기",
      chips: ["로타갈이 뭐예요?", "구매는 어디서 하나요?", "접종 시기가 궁금해요", "연락처 알려주세요"],
      fallback: "죄송해요, 그 부분은 제가 바로 답변드리기 어렵네요. <a href=\"tel:" + TEL + "\">" + TEL + "</a> 또는 <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>으로 문의주시면 빠르게 안내해 드립니다.",
      disclaimer: "동물용 의약품의 사용은 반드시 수의사의 지도에 따라 주세요."
    },
    en: {
      title: "AGRO Assistant",
      status: "Online",
      greeting: "Hello! This is the <b>Korea Agro</b> assistant.<br/>Ask me about our products, purchasing or partnerships.",
      placeholder: "Type your question…",
      send: "Send",
      openLabel: "Open chat assistant",
      chips: ["What is ROTAGAL?", "Where can I buy?", "Vaccination timing", "Contact info"],
      fallback: "Sorry, I can't answer that right away. Please contact us at <a href=\"tel:" + TEL_INTL + "\">" + TEL_INTL + "</a> or <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>.",
      disclaimer: "Veterinary medicines must be used under veterinary guidance."
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
      kw: ["몬스멕타", "monsmecta"],
      ko: "<b>MONSMECTA(몬스멕타)</b>는 수의사 전용으로 공급되는 장 점막 보호 솔루션입니다. 온라인 판매가 아닌 전문 채널 공급 제품으로, 공급 조건은 문의를 통해 안내해 드립니다.<br/><br/>자세히: " + a(pl("monsmecta"), "MONSMECTA 제품 페이지"),
      en: "<b>MONSMECTA</b> is a veterinarian-exclusive intestinal mucosal protection solution supplied through professional channels only. Contact us for supply details.<br/><br/>More: " + a(pl("monsmecta"), "MONSMECTA page")
    },
    {
      kw: ["구매", "구입", "주문", "스마트스토어", "네이버", "쿠팡", "가격", "얼마", "buy", "order", "price", "coupang", "naver", "store", "shop"],
      ko: "베타콜과 파보겔은 <b>네이버 스마트스토어·쿠팡 공식 입점 몰</b> 및 각 브랜드 사이트(vetacol.kr · parvogel.kr)에서 구매하실 수 있습니다. 백신(로타갈)과 몬스멕타는 전화 문의를 통해 도입 상담을 진행해 주세요.<br/><br/>" + a("#store", "공식 온라인 스토어 보기") + " · " + a("tel:" + TEL, "도입 문의 " + TEL),
      en: "VETACOL and PARVOGEL are available via our official <b>Naver Smart Store and Coupang storefronts</b> and brand sites (vetacol.kr · parvogel.kr). For the ROTAGAL vaccine and MONSMECTA, please call for supply consultation.<br/><br/>" + a("#store", "Official online stores") + " · " + a("tel:" + TEL_INTL, "Call " + TEL_INTL)
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

  function setOpen(openState) {
    document.body.classList.toggle("chat-open", openState);
    fab.setAttribute("aria-expanded", openState ? "true" : "false");
    if (openState && !bodyEl.childElementCount) {
      addMsg(t.greeting, "bot");
      addChips();
    }
    if (openState) { input.focus(); }
  }

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

  window.AGRO_CHAT = { ask: ask, localReply: localReply };
})();
