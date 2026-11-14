(function () {
  var current = document.body.getAttribute('data-doc') || 'index.html';
  var navRoot = document.getElementById('nav');
  var tocRoot = document.getElementById('toc');
  var toggle = document.getElementById('nav-toggle');
  var form = document.getElementById('search-form');
  var input = document.getElementById('search');
  var panel = document.getElementById('search-panel');

  function relFrom(toRel) {
    var fromDir = current.split('/').slice(0, -1);
    var toParts = toRel.split('/');
    var shared = 0;
    while (shared < fromDir.length && fromDir[shared] === toParts[shared]) shared += 1;
    var parts = [];
    for (var i = 0; i < fromDir.length - shared; i += 1) parts.push('..');
    for (var j = shared; j < toParts.length; j += 1) parts.push(toParts[j]);
    return parts.join('/') || toParts[toParts.length - 1];
  }

  function contains(node, href) {
    if (node.type === 'page') return node.href === href;
    return (node.children || []).some(function (child) { return contains(child, href); });
  }

  function addPages(list, nodes) {
    nodes.forEach(function (node) {
      var item = document.createElement('li');
      if (node.type === 'page') {
        var link = document.createElement('a');
        link.href = relFrom(node.href);
        link.textContent = node.title;
        if (node.href === current) link.setAttribute('aria-current', 'page');
        item.appendChild(link);
      } else {
        var details = document.createElement('details');
        var depth = node.hrefDepth || 0;
        if (depth === 0 || contains(node, current)) details.open = true;
        var summary = document.createElement('summary');
        summary.textContent = node.title;
        details.appendChild(summary);
        var nested = document.createElement('ul');
        (node.children || []).forEach(function (child) {
          child.hrefDepth = depth + 1;
        });
        addPages(nested, node.children || []);
        details.appendChild(nested);
        item.appendChild(details);
      }
      list.appendChild(item);
    });
  }

  function renderNav() {
    var nodes = window.DOC_NAV || [];
    nodes.forEach(function (node) { node.hrefDepth = 0; });
    var list = document.createElement('ul');
    addPages(list, nodes);
    navRoot.appendChild(list);
    var currentLink = navRoot.querySelector('[aria-current="page"]');
    if (currentLink) currentLink.scrollIntoView({ block: 'nearest' });
  }

  function renderToc() {
    var article = document.querySelector('.doc');
    var heads = article.querySelectorAll('h2, h3');
    if (!heads.length) return;
    var label = document.createElement('p');
    label.textContent = 'このページ';
    var list = document.createElement('ul');
    heads.forEach(function (head) {
      if (!head.id) return;
      var item = document.createElement('li');
      if (head.tagName === 'H3') item.className = 'toc-h3';
      var link = document.createElement('a');
      link.href = '#' + head.id;
      link.textContent = head.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });
    tocRoot.appendChild(label);
    tocRoot.appendChild(list);

    var links = list.querySelectorAll('a');
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    heads.forEach(function (head) { observer.observe(head); });
  }

  function hideSearch() {
    panel.hidden = true;
    panel.innerHTML = '';
  }

  function appendExcerpt(parent, text, query) {
    var hay = text.toLowerCase();
    var needle = query.toLowerCase();
    var at = hay.indexOf(needle);
    if (at < 0) {
      parent.textContent = text.slice(0, 120);
      return;
    }
    var start = Math.max(0, at - 36);
    var end = Math.min(text.length, at + needle.length + 72);
    if (start > 0) parent.appendChild(document.createTextNode('…'));
    parent.appendChild(document.createTextNode(text.slice(start, at)));
    var mark = document.createElement('mark');
    mark.textContent = text.slice(at, at + needle.length);
    parent.appendChild(mark);
    parent.appendChild(document.createTextNode(text.slice(at + needle.length, end)));
    if (end < text.length) parent.appendChild(document.createTextNode('…'));
  }

  function renderSearch() {
    var query = input.value.trim();
    if (!query) {
      hideSearch();
      return;
    }
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = (window.DOC_SEARCH || []).filter(function (page) {
      var hay = (page.title + ' ' + page.text).toLowerCase();
      return terms.every(function (term) { return hay.indexOf(term) !== -1; });
    });
    hits.sort(function (a, b) {
      function titleHit(page) {
        var title = page.title.toLowerCase();
        return terms.every(function (term) { return title.indexOf(term) !== -1; }) ? 0 : 1;
      }
      return titleHit(a) - titleHit(b);
    });
    hits = hits.slice(0, 20);
    panel.innerHTML = '';
    panel.hidden = false;
    if (!hits.length) {
      var empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = '該当なし';
      panel.appendChild(empty);
      return;
    }
    hits.forEach(function (page) {
      var link = document.createElement('a');
      link.href = relFrom(page.href);
      var title = document.createElement('strong');
      title.textContent = page.title;
      var path = document.createElement('small');
      path.textContent = page.href;
      var excerpt = document.createElement('p');
      appendExcerpt(excerpt, page.text, terms[0]);
      link.appendChild(title);
      link.appendChild(path);
      link.appendChild(excerpt);
      panel.appendChild(link);
    });
  }

  renderNav();
  renderToc();

  toggle.addEventListener('click', function () {
    var open = navRoot.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navRoot.addEventListener('click', function (event) {
    if (event.target.closest('a')) navRoot.classList.remove('is-open');
  });

  input.addEventListener('input', renderSearch);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var first = panel.querySelector('a');
    if (first) window.location.href = first.href;
  });

  document.addEventListener('click', function (event) {
    if (!form.contains(event.target)) hideSearch();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      hideSearch();
      navRoot.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
