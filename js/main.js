(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var body = document.body;
  var openBtn = document.getElementById("menuOpen");
  var closeBtn = document.getElementById("menuClose");
  var mobileMenu = document.getElementById("mobileMenu");

  function setMenu(openState) {
    body.classList.toggle("menu-open", openState);
    openBtn.setAttribute("aria-expanded", openState ? "true" : "false");
    if (openState && closeBtn) {
      closeBtn.focus();
    }
  }
  if (openBtn) {
    openBtn.addEventListener("click", function () { setMenu(true); });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", function () { setMenu(false); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      setMenu(false);
      openBtn.focus();
    }
  });
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-to"), 10);
    if (isNaN(target)) { return; }
    if (reduceMotion) { el.textContent = String(target); return; }
    var duration = 950;
    var start = null;
    function step(ts) {
      if (!start) { start = ts; }
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll(".count");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  var langHint = document.getElementById("langHint");
  if (langHint) {
    var dismissed = false;
    try { dismissed = window.localStorage.getItem("agroLangHint") === "off"; } catch (e) {}
    var navLang = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    var isKorean = /^ko/i.test(navLang);
    var closeBtn = langHint.querySelector("[data-close]");
    if (!dismissed && !isKorean) {
      langHint.hidden = false;
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        langHint.hidden = true;
        try { window.localStorage.setItem("agroLangHint", "off"); } catch (e) {}
      });
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Product detail modal
  (function () {
    if (!window.PRODUCT_DATA) return;
    var data = window.PRODUCT_DATA;
    var byUid = {};
    data.forEach(function (p) { byUid[p.uid] = p; });

    var modalWrap = document.createElement("div");
    modalWrap.className = "prod-modal-backdrop";
    modalWrap.setAttribute("id", "prodModal");
    modalWrap.setAttribute("role", "dialog");
    modalWrap.setAttribute("aria-modal", "true");
    modalWrap.setAttribute("aria-label", "제품 상세 정보");
    modalWrap.innerHTML =
      '<div class="prod-modal" role="document">' +
      '<button class="prod-modal-close" aria-label="닫기">&times;</button>' +
      '<img class="prod-modal-img" alt="" />' +
      '<div class="prod-modal-body">' +
      '<h3 class="prod-modal-name"></h3>' +
      '<div class="prod-modal-content"></div>' +
      '<a class="prod-modal-buy" href="/contact.html">구매 문의하기 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M7 17L17 7M9 7h8v8"/></svg></a>' +
      "</div>" +
      "</div>";
    document.body.appendChild(modalWrap);

    var imgEl = modalWrap.querySelector(".prod-modal-img");
    var nameEl = modalWrap.querySelector(".prod-modal-name");
    var contentEl = modalWrap.querySelector(".prod-modal-content");
    var buyEl = modalWrap.querySelector(".prod-modal-buy");
    var closeBtn = modalWrap.querySelector(".prod-modal-close");

    function esc(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function render(p) {
      if (!p) return;
      imgEl.src = p.image;
      imgEl.alt = p.name;
      nameEl.textContent = p.name;

      var html = "";
      var fields = [
        ["제품설명", "description"],
        ["주요성분 및 함량", "ingredients"],
        ["대상축종", "targetLivestock"],
        ["용법 및 용량", "usage"],
        ["포장단위", "packaging"],
        ["제품유효기간", "shelfLife"],
        ["제조사 및 원산지", "manufacturer"],
      ];
      fields.forEach(function (pair) {
        var label = pair[0];
        var value = p[pair[1]];
        if (value) {
          var lines = value
            .split("\n")
            .map(function (l) { return l.trim(); })
            .filter(Boolean);
          if (pair[0] === "주요성분 및 함량") {
            html +=
              '<div class="prod-modal-section"><h4>' +
              label +
              '</h4><ul><li>' +
              lines.join("</li><li>") +
              "</li></ul></div>";
          } else {
            html +=
              '<div class="prod-modal-section"><h4>' +
              label +
              "</h4><p>" +
              esc(value) +
              "</p></div>";
          }
        }
      });
      contentEl.innerHTML = html;
      buyEl.href = "/contact.html";
    }

    function openModal(uid) {
      var p = byUid[String(uid)];
      if (!p) return;
      render(p);
      modalWrap.classList.add("open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      modalWrap.classList.remove("open");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeModal);
    modalWrap.addEventListener("click", function (e) {
      if (e.target === modalWrap) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalWrap.classList.contains("open")) {
        closeModal();
      }
    });

    document
      .querySelectorAll(".prod-card[data-uid]")
      .forEach(function (card) {
        card.addEventListener("click", function (e) {
          e.preventDefault();
          openModal(card.getAttribute("data-uid"));
        });
        card.style.cursor = "pointer";
      });
  // Hero slideshow
  (function () {
    var slideshow = document.querySelector('.hero-slideshow');
    if (!slideshow) return;
    var slides = slideshow.querySelectorAll('img');
    if (slides.length <= 1) return;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 4000);
  })();
})();
