// steps.js — rendering di un passo (titolo, teoria, testo, formule KaTeX)
// e dello stepper di navigazione.

export function renderStep({ titleId, bodyId, step }) {
  document.getElementById(titleId).textContent = step.title;
  const body = document.getElementById(bodyId);
  body.innerHTML = '';

  if (step.theory) {
    const theory = document.createElement('p');
    theory.className = 'hint';
    theory.textContent = step.theory;
    body.appendChild(theory);
  }

  (step.text || []).forEach((line) => {
    const p = document.createElement('p');
    p.textContent = line;
    body.appendChild(p);
  });

  (step.formulas || []).forEach((latex) => {
    const wrap = document.createElement('div');
    wrap.className = 'katex-display-block';
    try {
      katex.render(latex, wrap, { throwOnError: false, displayMode: true });
    } catch (e) {
      wrap.textContent = latex;
    }
    body.appendChild(wrap);
  });
}

export function renderStepper(containerId, steps, currentIndex, onSelect) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  steps.forEach((step, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'step-dot' + (i === currentIndex ? ' active' : '') + (i < currentIndex ? ' done' : '');
    dot.textContent = String(i + 1);
    dot.title = step.title;
    dot.addEventListener('click', () => onSelect(i));
    container.appendChild(dot);
  });
}
