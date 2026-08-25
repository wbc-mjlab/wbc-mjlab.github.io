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

    // Same-origin wbc-demo: start the embed in tracking with HUD hidden (H),
    // without requiring demo URL/API changes.
    frame.addEventListener("load", function () {
      var win = frame.contentWindow;
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        try {
          if (!win || !win.__engine) {
            if (tries > 100) clearInterval(timer);
            return;
          }
          clearInterval(timer);
          var doc = win.document;
          var root = doc && doc.querySelector("#lv-root");
          if (!root || root.getAttribute("data-hud") === "off") return;
          // Dispatch on <body> so the demo key handler's HTMLElement check passes.
          var body = doc.body;
          if (!body) return;
          body.dispatchEvent(
            new KeyboardEvent("keydown", {
              code: "KeyH",
              key: "h",
              bubbles: true,
              cancelable: true,
            })
          );
        } catch (_) {
          clearInterval(timer);
        }
      }, 300);
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
