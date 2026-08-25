(function () {
  "use strict";

  var STORES = {
    parvogel: { naver: "", coupang: "" },
    vetacol: { naver: "", coupang: "" }
  };

  var LABELS = { naver: "네이버 스마트스토어에서 구매", coupang: "쿠팡에서 구매" };
  var DOTS = { naver: "#03c75a", coupang: "#ae2b2b" };
  var ORDER = ["naver", "coupang"];

  var boxes = document.querySelectorAll(".buy-box[data-product]");
  Array.prototype.forEach.call(boxes, function (box) {
    var key = box.getAttribute("data-product");
    var links = STORES[key];
    if (!links) { return; }
    var parts = [];
    ORDER.forEach(function (mall) {
      if (links[mall]) {
        parts.push(
          '<a class="buy-btn" target="_blank" rel="noopener" href="' + links[mall] + '">' +
          '<i class="dot" style="background:' + DOTS[mall] + '"></i>' + LABELS[mall] + "</a>"
        );
      }
    });
    if (!parts.length) { return; }
    box.innerHTML = '<span class="buy-box-title">공식 온라인 구매처</span>' + parts.join("");
  });
})();
