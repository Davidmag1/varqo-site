(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = window.localStorage.getItem('varqo-motion') === 'paused'; } catch { /* Storage is optional. */ }
  window.varqoReducedMotion = () => preference.matches || paused;
  const motionButtons = [...document.querySelectorAll('[data-motion-toggle]')];
  const syncMotion = () => {
    const reduced = window.varqoReducedMotion();
    root.dataset.motion = reduced ? 'paused' : 'running';
    motionButtons.forEach(motionButton => {
      motionButton.hidden = false;
      motionButton.textContent = preference.matches ? 'Reduced motion enabled' : paused ? 'Resume motion' : 'Pause motion';
      motionButton.setAttribute('aria-pressed', String(reduced));
      motionButton.disabled = preference.matches;
    });
    window.dispatchEvent(new Event('varqo-motion-change'));
  };
  motionButtons.forEach(button => button.addEventListener('click', () => {
    paused = !paused;
    try { window.localStorage.setItem('varqo-motion', paused ? 'paused' : 'running'); } catch { /* Storage is optional. */ }
    syncMotion();
  }));
  preference.addEventListener('change', syncMotion);
  syncMotion();

  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('#main-nav');
  if (menu && links) {
    menu.hidden = false;
    root.classList.add('menu-ready');
    const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); links.classList.remove('is-open'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && links.classList.contains('is-open')) { closeMenu(); menu.focus(); }
    });
    links.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    const narrow = window.matchMedia('(max-width: 760px)');
    narrow.addEventListener('change', closeMenu);
  }

  const scene = document.querySelector('[data-reality-scene]');
  if (scene) {
    let timer;
    let visible = true;
    let verified = false;
    const render = value => {
      verified = value;
      scene.dataset.phase = value ? 'verified' : 'held';
      scene.querySelector('[data-reality-state]').textContent = value ? 'Resource is active' : 'Resource still off';
      scene.querySelector('[data-reality-gate]').textContent = value ? 'RELEASED' : 'HOLD';
    };
    const schedule = () => {
      window.clearTimeout(timer);
      if (window.varqoReducedMotion()) { render(true); return; }
      if (!visible || document.hidden) return;
      timer = window.setTimeout(() => { render(!verified); schedule(); }, verified ? 3800 : 3000);
    };
    window.addEventListener('varqo-motion-change', schedule);
    document.addEventListener('visibilitychange', schedule);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); });
      observer.observe(scene);
    }
    schedule();
  }

  const lab = document.querySelector('[data-lab-explorer]');
  if (!lab) return;
  // Marketing illustrations of fixed console scenarios, never kernel verdicts.
  const scenarios = {
    healthy: ['Verified activation', 'RELEASED', 'completed', 'active', '1', 'Both action completion and resulting resource state are independently verified. One idempotent local effect may run.', ''],
    divergence: ['Success without the outcome', 'HELD', 'completed', 'off', '0', 'The provider action completed, but the required resource state remains unproven. The dependent effect stays held.', 'held'],
    failure: ['Provider failure', 'BLOCKED', 'errored', 'not evaluated', '0', 'The action failed. A terminal provider failure blocks dependent execution before a resource proof can release it.', 'held'],
    outage: ['Verifier unavailable', 'HELD', 'unavailable', 'unavailable', '0', 'An unavailable read is missing evidence. It cannot prove the required state or authorize the dependent effect.', 'held'],
    paused: ['Pause & resume', 'HOLDING', 'pending proof', 'pending proof', '0', 'One write is captured. After restart, the local console can resume verification explicitly; only authenticated proof can release one local effect. No write is replayed.', 'local']
  };
  lab.querySelectorAll('[data-lab-scenario]').forEach(button => button.addEventListener('click', () => {
    lab.querySelectorAll('[data-lab-scenario]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const data = scenarios[button.dataset.labScenario];
    const names = ['title', 'gate', 'action', 'resource', 'effects', 'explanation'];
    names.forEach((name, index) => { lab.querySelector(`[data-lab-${name}]`).textContent = data[index]; });
    lab.querySelector('[data-lab-gate]').className = `scope ${data[6]}`;
    lab.querySelector('.lab-view').dataset.outcome = data[1];
  }));
})();
