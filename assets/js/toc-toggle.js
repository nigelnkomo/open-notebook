(function () {
  if (window.innerWidth <= 1023) return;
  var toggle = document.querySelector('.toc-toggle');
  var page = document.querySelector('.page');
  var sidebar = document.querySelector('.sidebar__right');
  if (!toggle || !page || !sidebar) return;

  function setIcon(name) {
    toggle.innerHTML = '<i data-lucide="' + name + '" class="icon toc-toggle-icon"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function isOpen() {
    return page.classList.contains('toc-open');
  }

  function open() {
    if (isOpen()) return;
    page.classList.add('toc-open');
    sidebar.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setIcon('x');
    document.dispatchEvent(new CustomEvent('toc:open'));
  }

  function close() {
    if (!isOpen()) return;
    page.classList.remove('toc-open');
    sidebar.classList.remove('is-open');
    document.body.style.overflow = '';
    setIcon('list');
    document.dispatchEvent(new CustomEvent('toc:close'));
  }

  function toggleToc() {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  }

  toggle.addEventListener('click', toggleToc);

  sidebar.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      close();
    }
  });

  document.addEventListener('toc:toggle', toggleToc);
  document.addEventListener('toc:open', function () { if (!isOpen()) open(); });
  document.addEventListener('toc:close', function () { if (isOpen()) close(); });
})();
