(() => {
  if (/^https?:$/.test(window.location.protocol)) {
    const { pathname, search, hash } = window.location;
    let cleanPath = pathname;

    if (pathname.endsWith('/index.html')) {
      cleanPath = pathname.slice(0, -'index.html'.length);
    } else if (pathname.endsWith('.html')) {
      cleanPath = pathname.slice(0, -'.html'.length);
    }

    if (cleanPath !== pathname) {
      window.history.replaceState(null, '', `${cleanPath}${search}${hash}`);
    }
  }

  const header = document.querySelector('.site-header');
  const year = document.querySelector('[data-year]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = String(new Date().getFullYear());
  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 8);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const elements = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });

    elements.forEach((element) => observer.observe(element));
  }

  const simulator = document.querySelector('[data-simulator]');
  if (!simulator) return;

  const scenarios = {
    verified: {
      result: 'release',
      decision: 'RELEASE',
      copy: 'The required resource state is independently verified. The dependent action may continue.',
      events: [
        ['Power on cloud machine', 'dropletActions_post', 'EXECUTED', 'complete'],
        ['Asynchronous action completed', 'status = completed', 'OBSERVED', 'complete'],
        ['Resource converged to required state', 'machine.state = active', 'VERIFIED', 'complete'],
        ['Continue agent workflow', 'completion action', 'RELEASED', 'complete']
      ]
    },
    'false-success': {
      result: 'hold',
      decision: 'HOLD',
      copy: 'The provider action completed, but the required resource state is false. Dependent execution stays held.',
      events: [
        ['Power on cloud machine', 'dropletActions_post', 'EXECUTED', 'complete'],
        ['Asynchronous action completed', 'status = completed', 'OBSERVED', 'complete'],
        ['Required state not present', 'machine.state = off', 'NOT VERIFIED', 'warning'],
        ['Do not continue workflow', 'completion action', 'HELD', 'warning']
      ]
    },
    timeout: {
      result: 'unresolved',
      decision: 'UNRESOLVED',
      copy: 'The verifier remained transient until its poll budget was exhausted. Uncertainty is not permission to continue.',
      events: [
        ['Power on cloud machine', 'dropletActions_post', 'EXECUTED', 'complete'],
        ['Action remains transient', 'status = in-progress', 'RETRY', 'complete'],
        ['Poll budget exhausted', 'no terminal observation', 'UNRESOLVED', 'warning'],
        ['Do not continue workflow', 'completion action', 'HELD', 'warning']
      ]
    }
  };

  const options = [...simulator.querySelectorAll('[data-scenario]')];
  const eventRows = [...simulator.querySelectorAll('[data-event]')];
  const runButton = simulator.querySelector('[data-run]');
  const decision = simulator.querySelector('[data-decision]');
  const decisionCopy = simulator.querySelector('[data-decision-copy]');
  let selected = 'verified';
  let timers = [];

  const clearTimers = () => { timers.forEach(window.clearTimeout); timers = []; };
  const reset = () => {
    clearTimers();
    simulator.removeAttribute('data-result');
    decision.textContent = 'READY';
    decisionCopy.textContent = 'Select a scenario, then run the workflow.';
    runButton.disabled = false;
    runButton.innerHTML = 'Run workflow <span aria-hidden="true">→</span>';
    const defaults = [
      ['Waiting to run', '—', 'READY'],
      ['Not observed', '—', 'PENDING'],
      ['Not executed', '—', 'PENDING'],
      ['Awaiting proof', '—', 'HELD']
    ];
    eventRows.forEach((row, index) => {
      row.className = 'sim-event';
      row.querySelector('[data-event-title]').textContent = defaults[index][0];
      row.querySelector('[data-event-value]').textContent = defaults[index][1];
      row.querySelector('[data-event-state]').textContent = defaults[index][2];
    });
  };

  options.forEach((option) => option.addEventListener('click', () => {
    selected = option.dataset.scenario;
    options.forEach((item) => {
      const active = item === option;
      item.classList.toggle('selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
    reset();
  }));

  runButton.addEventListener('click', () => {
    reset();
    runButton.disabled = true;
    runButton.textContent = 'Running verification…';
    const scenario = scenarios[selected];
    const interval = reducedMotion ? 80 : 650;

    scenario.events.forEach((event, index) => {
      timers.push(window.setTimeout(() => {
        if (index > 0) eventRows[index - 1].classList.remove('active');
        const row = eventRows[index];
        row.classList.add('active', event[3]);
        row.querySelector('[data-event-title]').textContent = event[0];
        row.querySelector('[data-event-value]').textContent = event[1];
        row.querySelector('[data-event-state]').textContent = event[2];
      }, interval * index));
    });

    timers.push(window.setTimeout(() => {
      eventRows.at(-1).classList.remove('active');
      simulator.dataset.result = scenario.result;
      decision.textContent = scenario.decision;
      decisionCopy.textContent = scenario.copy;
      runButton.disabled = false;
      runButton.innerHTML = 'Replay scenario <span aria-hidden="true">↻</span>';
    }, interval * scenario.events.length));
  });
})();
