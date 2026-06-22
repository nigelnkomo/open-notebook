(function () {
  var lightStylesheet = document.getElementById('theme-light');
  var darkStylesheet = document.getElementById('theme-dark');
  var toggleButton = document.getElementById('theme-toggle');

  var getSystemTheme = function () {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  var setTheme = function (theme, isManual) {
    if (isManual) {
      if (theme === getSystemTheme()) {
        localStorage.removeItem('theme');
      } else {
        localStorage.setItem('theme', theme);
      }
    }

    if (lightStylesheet && darkStylesheet) {
      if (theme === 'dark') {
        darkStylesheet.disabled = false;
        lightStylesheet.disabled = true;
      } else {
        lightStylesheet.disabled = false;
        darkStylesheet.disabled = true;
      }
    }
    document.documentElement.setAttribute('data-theme', theme);

    if (toggleButton) {
      var icon = toggleButton.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      }
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  };

  var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(currentTheme, false);

  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var handleSystemChange = function () {
    if (localStorage.getItem('theme') === null) {
      setTheme(getSystemTheme(), false);
    }
  };
  mediaQuery.addEventListener('change', handleSystemChange);

  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';

      if (typeof window.showLoader === 'function') {
        window.showLoader();
      }

      setTheme(next, true);

      setTimeout(function () {
        if (typeof window.hideLoader === 'function') {
          window.hideLoader();
        }
      }, 120);
    });
  }
})();
