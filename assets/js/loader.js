(function () {
  var loader = document.getElementById('loader');

  var getBgColor = function () {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      return '#252a34';
    }
    return '#fff';
  };

  var applyCriticalStyles = function () {
    if (!loader) return;
    loader.style.position = 'fixed';
    loader.style.inset = '0px';
    loader.style.zIndex = '9999';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.pointerEvents = 'none';
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
    loader.style.transition = 'none';
    loader.style.background = getBgColor();
  };

  window.showLoader = function () {
    if (!loader) return;
    applyCriticalStyles();
    loader.classList.add('visible');
  };

  window.hideLoader = function () {
    if (!loader) return;
    loader.style.transition = '';
    loader.style.opacity = '';
    loader.style.visibility = '';
    loader.style.background = '';
    loader.classList.remove('visible');
  };
})();
