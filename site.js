(function () {
  'use strict';

  // Mobile nav
  var toggle = document.querySelector('.navtoggle');
  var nav = document.getElementById('sitenav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  // Program accordions.
  // The markup ships expanded, so with no JS every program is readable.
  // Here we collapse all but the first and wire up the toggles.
  var programs = document.querySelectorAll('.program');
  programs.forEach(function (p, i) {
    var btn = p.querySelector('button');
    var body = p.querySelector('.body');
    if (!btn || !body) return;

    if (!body.id) body.id = (p.id || 'program-' + i) + '-body';
    btn.setAttribute('aria-controls', body.id);

    function setOpen(open) {
      p.classList.toggle('collapsed', !open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    setOpen(i === 0);

    btn.addEventListener('click', function () {
      setOpen(p.classList.contains('collapsed'));
    });
  });

  // If someone lands on a deep link like /what-we-do.html#economic, open it.
  if (window.location.hash) {
    var target = document.querySelector('.program' + window.location.hash);
    if (target) {
      var b = target.querySelector('button');
      target.classList.remove('collapsed');
      if (b) b.setAttribute('aria-expanded', 'true');
      target.scrollIntoView({ block: 'start' });
    }
  }

  // One reveal on scroll. Skipped when the viewer prefers less motion, and
  // skipped without IntersectionObserver so content never stays hidden.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
