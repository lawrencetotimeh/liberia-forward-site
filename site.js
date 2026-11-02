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

  // Program accordions. <details> carries the state; the button is the control,
  // so keyboard and screen readers get a real expanded/collapsed relationship.
  document.querySelectorAll('.program').forEach(function (d) {
    var btn = d.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      d.open = !d.open;
      btn.setAttribute('aria-expanded', d.open ? 'true' : 'false');
    });
  });

  // One reveal on scroll. Skipped entirely when the viewer prefers less motion,
  // and skipped if IntersectionObserver is missing so content never stays hidden.
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
