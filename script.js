(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Theme toggle (with View Transitions where supported)
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    };
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply);
    else apply();
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`;
    io.observe(el);
  });

  // Active nav link
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && navIO.observe(s));

  // Terminal typing loop
  const typed = document.getElementById('typed');
  const lines = ['echo "building impactful products"', 'echo "helping businesses integrate AI"'];
  if (reduceMotion) { typed.textContent = lines[0]; }
  else {
    let li = 0, ci = 0, deleting = false;
    const tick = () => {
      const line = lines[li];
      typed.textContent = line.slice(0, ci);
      if (!deleting && ci < line.length) { ci++; setTimeout(tick, 55 + Math.random() * 60); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
      else if (ci > 0) { ci--; setTimeout(tick, 25); }
      else { deleting = false; li = (li + 1) % lines.length; setTimeout(tick, 350); }
    };
    setTimeout(tick, 900);
  }

  // Show the résumé button only once assets/resume.pdf exists
  const resumeBtn = document.getElementById('resumeBtn');
  if (location.protocol.startsWith('http')) {
    fetch(resumeBtn.getAttribute('href'), { method: 'HEAD' })
      .then((r) => { if (r.ok && !/text\/html/.test(r.headers.get('content-type') || '')) resumeBtn.hidden = false; })
      .catch(() => {});
  }
})();
