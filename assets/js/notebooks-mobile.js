(function () {
  if (window.innerWidth > 1023) return;

  var main = document.querySelector('#main');
  var toggle = document.querySelector('.toc-toggle');
  var sidebarToggle = document.querySelector('.sidebar-toggle');
  var page = document.querySelector('.page');
  var sidebar = document.querySelector('.sidebar__right');
  var scrollY = 0;
  if (!main || !toggle || !sidebarToggle || !page || !sidebar) return;

  /* ---- TOC toggle ---- */
  function setTocIcon(name) {
    toggle.innerHTML = '<i data-lucide="' + name + '" class="icon toc-toggle-icon"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function tocIsOpen() {
    return page.classList.contains('toc-open');
  }

  function lockScroll() {
    document.body.style.top = '-' + scrollY + 'px';
  }

  function unlockScroll() {
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function openToc() {
    if (tocIsOpen()) return;
    scrollY = window.scrollY;
    if (scrollY > 0) window.scrollTo(0, 0);
    page.classList.add('toc-open');
    sidebar.classList.add('is-open');
    lockScroll();
    document.body.classList.add('is-toc-open');
    setTocIcon('x');
    document.dispatchEvent(new CustomEvent('toc:open'));
  }

  function closeToc() {
    if (!tocIsOpen()) return;
    page.classList.remove('toc-open');
    sidebar.classList.remove('is-open');
    document.body.classList.remove('is-toc-open');
    unlockScroll();
    setTocIcon('list');
    document.dispatchEvent(new CustomEvent('toc:close'));
  }

  function toggleToc() {
    if (tocIsOpen()) {
      closeToc();
    } else {
      openToc();
    }
  }

  toggle.addEventListener('click', toggleToc);

  sidebar.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      closeToc();
    }
  });

  /* ---- Sidebar toggle ---- */
  function setSidebarIcon(name) {
    sidebarToggle.innerHTML = '<i data-lucide="' + name + '" class="icon sidebar-toggle-icon"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function navIsOpen() {
    return main.classList.contains('notebook--nav-open');
  }

  function closeNav() {
    if (!navIsOpen()) return;
    main.classList.remove('notebook--nav-open');
    document.body.classList.remove('is-nav-open');
    unlockScroll();
    setSidebarIcon('menu');
    document.dispatchEvent(new CustomEvent('notebook:sidebar-close'));
  }

  function openNav() {
    if (navIsOpen()) return;
    scrollY = window.scrollY;
    if (scrollY > 0) window.scrollTo(0, 0);
    main.classList.add('notebook--nav-open');
    document.body.classList.add('is-nav-open');
    lockScroll();
    setSidebarIcon('x');
    document.dispatchEvent(new CustomEvent('notebook:sidebar-open'));
  }

  function toggleNav() {
    if (navIsOpen()) {
      closeNav();
    } else {
      openNav();
    }
  }

  sidebarToggle.addEventListener('click', toggleNav);

  main.addEventListener('click', function (e) {
    if (e.target.closest('.sidebar-toggle')) return;
    if (e.target.closest('.sidebar a') && navIsOpen()) {
      closeNav();
    }
  });

  /* ---- Global keybindings ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (tocIsOpen()) closeToc();
      if (navIsOpen()) closeNav();
    }
  });

  /* ---- Mutual exclusion ---- */
  document.addEventListener('toc:open', closeNav);
  document.addEventListener('notebook:sidebar-open', closeToc);

  /* ---- External event listeners ---- */
  document.addEventListener('toc:toggle', toggleToc);
  document.addEventListener('toc:open', function () { if (!tocIsOpen()) openToc(); });
  document.addEventListener('toc:close', function () { if (tocIsOpen()) closeToc(); });
})();
