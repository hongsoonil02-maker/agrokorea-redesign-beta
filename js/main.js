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

  var betaRibbon = document.getElementById("betaRibbon");
  var betaClose = document.getElementById("betaClose");
  if (betaRibbon && betaClose) {
    betaClose.addEventListener("click", function () {
      betaRibbon.remove();
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
