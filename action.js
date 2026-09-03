(() => {
  const consoleEl = document.querySelector('[data-action-console]');
  if (!consoleEl) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runs = {
    mismatch: {
      title: 'Provider success. Workflow held.',
      subtitle: 'DigitalOcean · controlled live resource-state mismatch',
      verdict: 'HOLD',
      result: 'hold',
      copy: 'The provider action completed, but the independently observed resource state did not satisfy the task-bound outcome. Varqo did not permit downstream continuation.',
      metricLabel: 'Control invariant',
      metric: 'action completed ≠ outcome verified',
      events: [
        ['00.0s', 'Reboot requested', 'dropletActions_post', 'WRITE', 'done'],
        ['provider', 'Action reached terminal success', 'action.status = completed', 'VERIFIED', 'done'],
        ['independent', 'Resulting resource read', 'droplet.status = active', 'OBSERVED', 'done'],
        ['decision', 'Required task state not proven', 'expected state = off', 'UNRESOLVED', 'warn'],
        ['control', 'Dependent continuation', 'next_action = HOLD', 'HOLD', 'warn']
      ]
    },
    aws: {
      title: 'Runtime identity. Independent polling.',
      subtitle: 'AWS CodeBuild · live POST / batch verification',
      verdict: 'VERIFIED',
      result: 'verified',
      copy: 'A real StartBuild returned its identity only at runtime. Varqo bound that identity into BatchGetBuilds and independently polled until AWS reached its terminal success state.',
      metricLabel: 'Observed sequence',
      metric: '5 × RETRY → 1 × VERIFIED',
      events: [
        ['write', 'StartBuild accepted', 'runtime build identity returned', 'BOUND', 'done'],
        ['#1', 'Batch verifier', 'buildStatus = IN_PROGRESS', 'RETRY', 'done'],
        ['#2–5', 'Batch verifier', 'buildStatus = IN_PROGRESS', 'RETRY', 'done'],
        ['#6', 'Batch verifier', 'buildStatus = SUCCEEDED', 'VERIFIED', 'good'],
        ['final', 'Proof completed', 'FINAL VERIFIED', 'VERIFIED', 'good']
      ]
    },
    agent: {
      title: 'The agent asked to continue too early.',
      subtitle: 'OpenAI tool agent · controlled live dependent-action gate',
      verdict: 'RELEASE',
      result: 'release',
      copy: 'A real tool-using agent requested its dependent completion action while proof was still pending. The call stayed held until independent verification completed, then the gate released exactly once.',
      metricLabel: 'Dependent call held',
      metric: '9,775.43 ms before release',
      events: [
        ['agent', 'Dependent action requested', 'complete_task()', 'REQUESTED', 'done'],
        ['gate', 'Proof unavailable', 'state = HOLDING', 'HOLD', 'warn'],
        ['verify', 'Independent provider reads', '14 × RETRY', 'RETRY', 'done'],
        ['verify', 'Terminal provider state observed', 'verdict = VERIFIED', 'VERIFIED', 'good'],
        ['ledger', 'One terminal transition', 'HOLDING → RELEASED', 'RELEASED', 'good']
      ]
    }
  };

  const tabs = [...consoleEl.querySelectorAll('[data-action-run-id]')];
  const title = consoleEl.querySelector('[data-action-title]');
  const subtitle = consoleEl.querySelector('[data-action-subtitle]');
  const events = consoleEl.querySelector('[data-action-events]');
  const summary = consoleEl.querySelector('[data-action-summary]');
  const verdict = consoleEl.querySelector('[data-action-verdict]');
  const copy = consoleEl.querySelector('[data-action-copy]');
  const metricLabel = consoleEl.querySelector('[data-action-metric-label]');
  const metric = consoleEl.querySelector('[data-action-metric]');
  const button = consoleEl.querySelector('[data-action-play]');
  let selected = 'mismatch';
  let timers = [];

  const clearTimers = () => {
    timers.forEach(window.clearTimeout);
    timers = [];
  };

  const renderRun = () => {
    clearTimers();
    const run = runs[selected];
    title.textContent = run.title;
    subtitle.textContent = run.subtitle;
    verdict.textContent = 'READY';
    copy.textContent = 'Play the sanitized trace from the recorded live run.';
    metricLabel.textContent = run.metricLabel;
    metric.textContent = run.metric;
    summary.removeAttribute('data-result');
    button.disabled = false;
    button.innerHTML = 'Play real run <span aria-hidden="true">→</span>';
    events.innerHTML = run.events.map((event) => `
      <div class="action-event">
        <span class="action-time">${event[0]}</span>
        <div><strong>${event[1]}</strong><code>${event[2]}</code></div>
        <span class="action-state">${event[3]}</span>
      </div>`).join('');
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    selected = tab.dataset.actionRunId;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderRun();
  }));

  button.addEventListener('click', () => {
    clearTimers();
    renderRun();
    const run = runs[selected];
    const rows = [...events.querySelectorAll('.action-event')];
    const interval = reducedMotion ? 70 : 520;
    button.disabled = true;
    button.textContent = 'Playing recorded trace…';

    rows.forEach((row, index) => {
      timers.push(window.setTimeout(() => {
        if (index > 0) rows[index - 1].classList.remove('active');
        row.classList.add('active', run.events[index][4]);
      }, interval * index));
    });

    timers.push(window.setTimeout(() => {
      rows.at(-1)?.classList.remove('active');
      verdict.textContent = run.verdict;
      copy.textContent = run.copy;
      summary.dataset.result = run.result;
      button.disabled = false;
      button.innerHTML = 'Replay real run <span aria-hidden="true">↻</span>';
    }, interval * rows.length));
  });

  renderRun();
})();
