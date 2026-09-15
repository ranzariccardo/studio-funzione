// steps.js — rendering di un passo (titolo, teoria, testo, formule KaTeX)
// e dello stepper di navigazione.

function appendFormulas(container, formulas) {
  (formulas || []).forEach((latex) => {
    const wrap = document.createElement('div');
    wrap.className = 'katex-display-block';
    try {
      katex.render(latex, wrap, { throwOnError: false, displayMode: true });
    } catch (e) {
      wrap.textContent = latex;
    }
    container.appendChild(wrap);
  });
}

export function renderStep({ titleId, bodyId, step, revealed, onReveal }) {
  document.getElementById(titleId).textContent = step.title;
  const body = document.getElementById(bodyId);
  body.innerHTML = '';

  if (step.theory) {
    const theory = document.createElement('p');
    theory.className = 'hint';
    theory.textContent = step.theory;
    body.appendChild(theory);
  }

  const isRevealStep = Array.isArray(step.answer);

  if (!isRevealStep) {
    // formato legacy (modalità guidata): testo ed eventuali formule sempre visibili
    (step.text || []).forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line;
      body.appendChild(p);
    });
    appendFormulas(body, step.formulas);
    return;
  }

  (step.prompt || []).forEach((line) => {
    const p = document.createElement('p');
    p.textContent = line;
    body.appendChild(p);
  });

  if (!revealed) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-secondary reveal-btn';
    btn.textContent = 'Mostra risposta';
    btn.addEventListener('click', () => onReveal && onReveal());
    body.appendChild(btn);
    return;
  }

  const box = document.createElement('div');
  box.className = 'answer-box';
  (step.answer || []).forEach((line) => {
    const p = document.createElement('p');
    p.textContent = line;
    box.appendChild(p);
  });
  appendFormulas(box, step.formulas);
  body.appendChild(box);
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
