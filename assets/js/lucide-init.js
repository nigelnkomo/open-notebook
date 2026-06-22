(function () {
  var renderIcons = function () {
    document.querySelectorAll(".page__content .header-link").forEach(function (link) {
      link.innerHTML = '<span class="sr-only">Permalink</span><i data-lucide="link" class="icon"></i>';
    });

    document.querySelectorAll(".page__content .clipboard-copy-button").forEach(function (button) {
      button.innerHTML =
        '<span class="sr-only">Copy code</span><i data-lucide="copy" class="icon"></i><i data-lucide="check" class="icon copied"></i>';
    });

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderIcons);
  } else {
    renderIcons();
  }
})();
