
// V90 UI: loader + page transitions
(() => {
  const loader = document.getElementById("pageLoader");

  function showLoader(text){
    if(!loader) return;
    const t = loader.querySelector(".loader-text");
    if(t && text) t.textContent = text;
    loader.classList.add("show");
  }

  function hideLoader(){
    if(!loader) return;
    loader.classList.remove("show");
  }

  window.v90Nav = (url, text="جاري الانتقال…") => {
    document.body.classList.add("page-fadeout");
    showLoader(text);
    setTimeout(() => { window.location.href = url; }, 220);
  };

  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");
    hideLoader();
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if(!a) return;
    const href = a.getAttribute("href");
    if(!href || href.startsWith("#")) return;
    if(a.hasAttribute("data-no-trans")) return;

    // same-origin only
    const url = new URL(href, window.location.href);
    if(url.origin !== window.location.origin) return;

    e.preventDefault();
    const txt = a.dataset.loaderText || "نجهز لك الصفحة…";
    window.v90Nav(url.href, txt);
  });

  // show loader on hard refresh / bfcache change
  window.addEventListener("beforeunload", () => {
    showLoader("لحظة…");
  });
})();
