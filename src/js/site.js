(function () {
  function renderMath() {
    if (typeof renderMathInElement !== "function") return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMath);
  } else {
    renderMath();
  }
  // KaTeX scripts are deferred; retry shortly if auto-render is not ready yet.
  window.addEventListener("load", renderMath);

  var teaser = document.querySelector("[data-teaser]");
  if (teaser) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var play = function () {
      if (!reduce) teaser.play().catch(function () {});
    };
    if (document.visibilityState === "visible") play();
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") play();
      else teaser.pause();
    });
  }

  var demo = document.querySelector("[data-demo]");
  var loadBtn = document.querySelector("[data-demo-load]");
  var frame = document.querySelector("[data-demo-src]");

  if (demo && loadBtn && frame) {
    loadBtn.addEventListener("click", function () {
      frame.src = frame.getAttribute("data-demo-src");
      frame.hidden = false;
      demo.classList.add("is-loaded");
    });
  }

  var copyBtn = document.querySelector("[data-copy-bib]");
  var bib = document.querySelector("[data-bib]");
  if (copyBtn && bib) {
    copyBtn.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(bib.textContent || "");
        copyBtn.textContent = "Copied";
        setTimeout(function () {
          copyBtn.textContent = "Copy";
        }, 1400);
      } catch (_) {
        copyBtn.textContent = "Select text";
      }
    });
  }
})();
