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

/* ---------- contact form: hand off to the visitor's own mail client ---------- */
(function(){
  var f = document.getElementById('inquiry');
  if(!f) return;
  var note = document.getElementById('formnote');

  function say(msg){ note.textContent = msg; note.hidden = false; }

  f.addEventListener('submit', function(e){
    e.preventDefault();
    if(!f.checkValidity()){
      say('Please fill in your name, email, reason for writing, and a message.');
      var bad = f.querySelector(':invalid');
      if(bad) bad.focus();
      return;
    }

    var d = new FormData(f);
    function v(k){ return (d.get(k) || '').toString().trim(); }

    var topic = v('topic');
    var to = (topic === 'Partnership or collaboration' ||
              topic === 'Business or investment in Liberia' ||
              topic === 'Government or embassy' ||
              topic === 'University or research')
             ? 'partnerships@liberiaforward.org'
             : 'info@liberiaforward.org';

    var subject = topic + ': ' + v('name') + (v('org') ? ' (' + v('org') + ')' : '');

    var lines = [];
    lines.push(v('message'));
    lines.push('');
    lines.push('---');
    lines.push('Name: ' + v('name'));
    if(v('org'))      lines.push('Organization: ' + v('org'));
    lines.push('Email: ' + v('email'));
    if(v('phone'))    lines.push('Phone: ' + v('phone'));
    lines.push('Reason for writing: ' + topic);
    if(v('timeline')) lines.push('Timeline: ' + v('timeline'));
    lines.push('Sent via liberiaforward.org');

    var url = 'mailto:' + to +
              '?subject=' + encodeURIComponent(subject) +
              '&body='    + encodeURIComponent(lines.join('\n'));

    if(url.length > 1900){
      say('That message is long enough that some email programs will cut it off. Shorten it here, or write to ' + to + ' and paste it in.');
      return;
    }

    say('Opening your email program with this message ready to send. If nothing opens, write to ' + to + ' instead.');
    var a = document.createElement('a');
    a.href = url;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
})();
