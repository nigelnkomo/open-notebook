(function () {
  if (window.innerWidth <= 1023) return;
  var toggle = document.querySelector('.sidebar-toggle');
  var main = document.querySelector('#main');
  if (!toggle || !main) return;

  function setIcon(name) {
    toggle.innerHTML = '<i data-lucide="' + name + '" class="icon sidebar-toggle-icon"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function isOpen() {
    return main.classList.contains('notebook--nav-open');
  }

  function closeNav() {
    if (!isOpen()) return;
    main.classList.remove('notebook--nav-open');
    document.body.style.overflow = '';
    setIcon('menu');
    document.dispatchEvent(new CustomEvent('notebook:sidebar-close'));
  }

  function openNav() {
    if (isOpen()) return;
    main.classList.add('notebook--nav-open');
    document.body.style.overflow = 'hidden';
    setIcon('x');
    document.dispatchEvent(new CustomEvent('notebook:sidebar-open'));
  }

  function toggleNav() {
    if (isOpen()) {
      closeNav();
    } else {
      openNav();
    }
  }

  toggle.addEventListener('click', toggleNav);

  main.addEventListener('click', function (e) {
    if (e.target.closest('.sidebar-toggle')) return;
    if (e.target.closest('.sidebar a') && isOpen()) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      closeNav();
    }
  });

  document.addEventListener('toc:open', closeNav);
  document.addEventListener('notebook:sidebar-open', function () {
    document.dispatchEvent(new CustomEvent('toc:close'));
  });
})();
