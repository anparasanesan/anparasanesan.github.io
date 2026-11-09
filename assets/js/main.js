/* ==========================================================
   Anparasanesan Tharmarajah — portfolio scripts
   1. theme toggle   2. mobile menu   3. dot network background
   4. typed role     5. reveal + counters   6. active nav
   7. blog filter    8. shell
   ========================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  };

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 1. theme ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    store.set('theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0b1220' : '#f4f7fa');
    network.readColors();
  }

  /* ---------- 3. dot network (declared early so the theme can recolour it) ---------- */
  var network = (function () {
    var canvas = document.getElementById('net');
    var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    var w = 0, h = 0, nodes = [], raf = 0, running = false;
    var mouse = { x: -9999, y: -9999 };
    var colA = '15,118,110', colB = '67,56,202';
    var LINK = 140, MOUSE = 190;

    function readColors() {
      var cs = getComputedStyle(root);
      colA = (cs.getPropertyValue('--net-a') || colA).trim();
      colB = (cs.getPropertyValue('--net-b') || colB).trim();
      if (!running) draw(false);
    }

    function makeNode() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() < 0.15 ? 2.6 : 1.7,
        alt: Math.random() < 0.2
      };
    }

    function resize() {
      if (!ctx) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.max(30, Math.min(170, Math.round((w * h) / 9000)));
      nodes = [];
      for (var i = 0; i < target; i++) nodes.push(makeNode());
      if (!running) draw(false);
    }

    function draw(move) {
      if (!ctx || !w) return;
      ctx.clearRect(0, 0, w, h);
      var i, j, n, p, q, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        if (move) { n.x += n.vx; n.y += n.vy; }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (move) {
          dx = mouse.x - n.x; dy = mouse.y - n.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE && d > 24) { n.x += (dx / d) * 0.3; n.y += (dy / d) * 0.3; }
        }
      }
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        p = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          q = nodes[j];
          dx = p.x - q.x; if (dx > LINK || dx < -LINK) continue;
          dy = p.y - q.y; if (dy > LINK || dy < -LINK) continue;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(' + colA + ',' + ((1 - d / LINK) * 0.32).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        dx = mouse.x - p.x; dy = mouse.y - p.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE) {
          ctx.strokeStyle = 'rgba(' + colB + ',' + ((1 - d / MOUSE) * 0.5).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        ctx.fillStyle = 'rgba(' + (n.alt ? colB : colA) + ',0.7)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function loop() {
      draw(true);
      raf = window.requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduceMotion || !ctx) return;
      running = true; loop();
    }
    function stop() {
      running = false; window.cancelAnimationFrame(raf);
    }

    if (ctx) {
      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; if (!running) draw(false); });
      document.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
      document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    }

    return {
      init: function () { readColors(); resize(); start(); },
      readColors: readColors
    };
  })();

  if (themeBtn) {
    themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeBtn.addEventListener('click', function () { applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'); });
  }
  network.init();

  /* ---------- 2. mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var navLinks = document.getElementById('nav-links');
  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open menu'); }
  }
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- 4. typed role ---------- */
  var typed = document.getElementById('typed');
  var roles = [
    'SENIOR FULL-STACK DEVELOPER',
    'LARAVEL · VUE.JS · REACT · PYTHON',
    'ML FEATURES IN REAL PRODUCTS',
    'TEAM LEAD · 15+ PROJECTS SHIPPED'
  ];
  if (typed && !reduceMotion) {
    var ri = 0, ci = roles[0].length, deleting = true;
    var tick = function () {
      var word = roles[ri];
      if (deleting) {
        ci--;
        if (ci <= 0) { deleting = false; ri = (ri + 1) % roles.length; }
      } else {
        ci++;
        if (ci >= roles[ri].length) { deleting = true; typed.textContent = roles[ri]; return setTimeout(tick, 2200); }
      }
      word = roles[ri];
      typed.textContent = word.slice(0, Math.max(ci, 0));
      setTimeout(tick, deleting ? 28 : 55);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- 5. reveal on scroll + counters ---------- */
  function formatNum(v, decimals) {
    return decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-GB');
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target) || reduceMotion) return;
    var t0 = null, dur = 1400;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = formatNum(target * eased, decimals) + suffix;
      if (k < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in');
        el.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 6. active nav link ---------- */
  var navMap = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navMap[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove('active'); });
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navMap).forEach(function (id) { var s = document.getElementById(id); if (s) navIo.observe(s); });
  }

  /* ---------- 7. blog filter ---------- */
  var pills = document.querySelectorAll('.pill[data-filter]');
  var posts = document.querySelectorAll('.post[data-track]');
  var emptyNote = document.getElementById('posts-empty');
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var f = pill.getAttribute('data-filter');
      pills.forEach(function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
      var shown = 0;
      posts.forEach(function (post) {
        var match = f === 'all' || post.getAttribute('data-track') === f;
        post.hidden = !match;
        if (match) { shown++; post.classList.add('in'); }
      });
      if (emptyNote) emptyNote.hidden = shown > 0;
    });
  });

  /* ---------- 8. shell ---------- */
  var termBody = document.getElementById('term-body');
  var termOut = document.getElementById('term-out');
  var termForm = document.getElementById('term-form');
  var termInput = document.getElementById('term-input');
  var CV = 'assets/Anparasanesan_Tharmarajah_CV.pdf';
  var history = [], hIndex = -1;

  function line(text, cls) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    termOut.appendChild(p);
    return p;
  }
  function linkLine(label, href) {
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.href = href; a.textContent = label;
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    p.appendChild(a);
    termOut.appendChild(p);
  }
  function echoCmd(cmd) {
    var p = document.createElement('p');
    var pr = document.createElement('span');
    pr.className = 'pr';
    pr.textContent = 'anparasanesan@dudley ~ $ ';
    p.appendChild(pr);
    p.appendChild(document.createTextNode(cmd));
    p.className = 'cmd';
    termOut.appendChild(p);
  }
  function goTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  var sections = ['skills', 'experience', 'projects', 'research', 'education', 'blog', 'contact'];

  var commands = {
    help: function () {
      [
        'whoami        who I am',
        'about         a short summary',
        'skills        my stack, grouped',
        'experience    where I have worked',
        'projects      things I have built',
        'research      papers and dissertation',
        'education     degrees and teaching',
        'contact       how to reach me',
        'cv            open my CV (PDF)',
        'github        open my GitHub',
        'linkedin      open my LinkedIn',
        'ls            list the page sections',
        'goto <name>   scroll to a section, e.g. goto projects',
        'theme <mode>  light or dark',
        'date          today\'s date',
        'clear         clear the screen'
      ].forEach(function (l) { line(l); });
    },
    whoami: function () {
      line('Anparasanesan Tharmarajah', 'ok');
      line('Senior Full-Stack Developer · Dudley, West Midlands, UK');
    },
    about: function () {
      line('Building e-commerce, e-learning and booking platforms since 2016 for clients in the UK, Germany, the US and Sri Lanka.');
      line('Led a team of 7 across 15+ projects. Since 2025: 10 freelance projects, three with ML and AI built in.');
      line('MSc Computer Science (University College Birmingham) · first-author ACM paper, ICEIT 2019.');
    },
    skills: function () {
      line('languages   PHP · JavaScript · TypeScript · Python · SQL · Node.js');
      line('frameworks  Laravel · Vue.js · React · Next.js · NestJS · Electron · Inertia.js · Ionic · WordPress');
      line('data        MySQL · PostgreSQL · MS SQL · Redis · Firebase');
      line('devops      AWS · VPS · Docker · Nginx · Apache · Git · cPanel/WHM');
      line('ml & ai     scikit-learn · LightGBM · SHAP · FastAPI · OpenCV · NLP · Claude & OpenAI APIs');
      line('growth      Technical SEO · Google Analytics · Google & Meta Ads · retargeting');
    },
    experience: function () {
      line('2025–now   Freelance Full-Stack Developer · UK');
      line('2021–2025  Senior Software Engineer (Team Lead) · Koceansoft');
      line('2019–2021  Software Developer · Prograva, Germany (remote)');
      line('2016–2019  Senior Web Developer · Global Edulink');
    },
    projects: function () {
      line('student-platform/     Laravel + React + FastAPI ML for weak-topic detection');
      line('pos-forecasting/      Electron + NestJS POS with LightGBM waste forecasting');
      line('travel-booking/       Next.js + Laravel with an OpenAI agent assistant');
      line('airport-parking/      Laravel + Vue.js, 1,000+ bookings a month on 4 brands');
      line('facial-recognition/   Python + OpenCV + CNNs (MSc)');
      line('Type "goto projects" to see them on the page.', 'dim');
    },
    research: function () {
      line('Smart Monitor for Tracking Child\'s Brain Development — ACM, ICEIT 2019');
      linkLine('doi:10.1145/3318396.3318401', 'https://doi.org/10.1145/3318396.3318401');
      line('Enhancing Lecturer Productivity through Machine Learning — MSc dissertation');
    },
    education: function () {
      line('2023–2025  MSc Computer Science · University College Birmingham');
      line('2014–2018  BSc (Hons) Information Technology · SLIIT');
    },
    contact: function () {
      linkLine('anparasanesan@gmail.com', 'mailto:anparasanesan@gmail.com');
      linkLine('linkedin.com/in/anparasanesan', 'https://www.linkedin.com/in/anparasanesan');
      linkLine('github.com/anparasanesan', 'https://github.com/anparasanesan');
    },
    cv: function () { line('Opening CV…', 'ok'); window.open(CV, '_blank', 'noopener'); },
    github: function () { line('Opening GitHub…', 'ok'); window.open('https://github.com/anparasanesan', '_blank', 'noopener'); },
    linkedin: function () { line('Opening LinkedIn…', 'ok'); window.open('https://www.linkedin.com/in/anparasanesan', '_blank', 'noopener'); },
    ls: function () { line(sections.map(function (s) { return s + '/'; }).join('  ')); },
    goto: function (args) {
      var target = (args[0] || '').replace(/\/$/, '').toLowerCase();
      if (sections.indexOf(target) === -1) { line('Usage: goto <' + sections.join('|') + '>', 'warn'); return; }
      line('Scrolling to ' + target + '…', 'ok'); goTo(target);
    },
    cd: function (args) { commands.goto(args); },
    theme: function (args) {
      var mode = (args[0] || '').toLowerCase();
      if (mode !== 'light' && mode !== 'dark') mode = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(mode); line('Theme set to ' + mode + '.', 'ok');
    },
    date: function () { line(new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })); },
    echo: function (args) { line(args.join(' ')); },
    sudo: function () { line('Permission denied. Nice try though.', 'warn'); },
    clear: function () { termOut.innerHTML = ''; }
  };

  function run(raw) {
    var input = raw.trim();
    echoCmd(input);
    if (!input) return;
    history.unshift(input); hIndex = -1;
    var parts = input.split(/\s+/);
    var name = parts[0].toLowerCase();
    var fn = commands[name];
    if (fn) fn(parts.slice(1));
    else line('command not found: ' + name + ' — type "help"', 'warn');
    termBody.scrollTop = termBody.scrollHeight;
  }

  if (termForm && termInput) {
    termForm.addEventListener('submit', function (e) {
      e.preventDefault();
      run(termInput.value);
      termInput.value = '';
    });
    termInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') {
        if (hIndex < history.length - 1) { hIndex++; termInput.value = history[hIndex]; }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (hIndex > 0) { hIndex--; termInput.value = history[hIndex]; } else { hIndex = -1; termInput.value = ''; }
        e.preventDefault();
      } else if (e.key === 'Tab') {
        var partial = termInput.value.trim().toLowerCase();
        if (!partial) return;
        var match = Object.keys(commands).filter(function (c) { return c.indexOf(partial) === 0; });
        if (match.length === 1) { termInput.value = match[0] + ' '; e.preventDefault(); }
      }
    });
    termBody.addEventListener('click', function (e) { if (!e.target.closest('a')) termInput.focus(); });
  }

  document.querySelectorAll('[data-open-shell]').forEach(function (a) {
    a.addEventListener('click', function () {
      setTimeout(function () { if (termInput) termInput.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
    });
  });
})();
