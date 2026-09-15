import { parseFunction } from './engine/parser.js';
import * as rationalEngine from './engine/rational.js';
import * as irrationalEngine from './engine/irrational.js';
import rationalExamples from './examples/rational.js';
import irrationalExamples from './examples/irrational.js';
import { renderStep, renderStepper } from './ui/steps.js';
import { resetGraph, addGraphOps, renderGraph } from './ui/graph.js';

const el = {
  input: document.getElementById('function-input'),
  typeSelect: document.getElementById('type-select'),
  detectedBanner: document.getElementById('detected-banner'),
  errorBanner: document.getElementById('error-banner'),
  startBtn: document.getElementById('start-btn'),
  setup: document.getElementById('setup'),
  study: document.getElementById('study'),
  graphWrap: document.getElementById('graph-wrap'),
  prevBtn: document.getElementById('prev-btn'),
  nextBtn: document.getElementById('next-btn'),
  restartBtn: document.getElementById('restart-btn'),
};

const TYPE_LABELS = {
  'rational-poly': 'funzione razionale polinomiale',
  'rational-fraction': 'funzione razionale fratta',
  irrational: 'funzione irrazionale (radice quadrata)',
};

let state = null;

function hideBanners() {
  el.detectedBanner.hidden = true;
  el.errorBanner.hidden = true;
}

function showError(message) {
  el.errorBanner.textContent = message;
  el.errorBanner.hidden = false;
}

function showStudySection() {
  el.setup.hidden = true;
  el.study.hidden = false;
  el.study.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function startGuided(type) {
  const examples = type === 'irrational' ? irrationalExamples : rationalExamples;
  const example = examples[type];

  state = {
    mode: 'guided',
    type,
    steps: example.steps,
    currentIndex: 0,
  };

  el.graphWrap.hidden = true;
  showStudySection();
  renderCurrentStep();
}

function startComputed(parsed) {
  const engine = parsed.type === 'irrational' ? irrationalEngine : rationalEngine;
  const steps = engine.computeSteps({ node: parsed.node });

  state = {
    mode: 'computed',
    type: parsed.type,
    steps,
    currentIndex: 0,
    exprString: parsed.node.toString(),
  };

  el.graphWrap.hidden = false;
  showStudySection();
  renderCurrentStep();
}

function renderCurrentStep() {
  const step = state.steps[state.currentIndex];

  renderStep({ titleId: 'step-title', bodyId: 'step-body', step });
  renderStepper('stepper', state.steps, state.currentIndex, (i) => {
    state.currentIndex = i;
    renderCurrentStep();
  });

  el.prevBtn.disabled = state.currentIndex === 0;
  el.nextBtn.textContent = state.currentIndex === state.steps.length - 1 ? 'Fine' : 'Passo successivo →';

  if (state.mode === 'computed') {
    resetGraph(state.exprString, [-10, 10]);
    for (let i = 0; i <= state.currentIndex; i++) {
      addGraphOps(state.steps[i].graphOps);
    }
    renderGraph('graph');
  }
}

el.startBtn.addEventListener('click', () => {
  hideBanners();
  const exprStr = el.input.getValue('ascii-math').trim();

  if (!exprStr) {
    startGuided(el.typeSelect.value);
    return;
  }

  const parsed = parseFunction(exprStr);
  if (parsed.error) {
    showError(parsed.error);
    return;
  }

  el.detectedBanner.textContent = `Ho riconosciuto: ${TYPE_LABELS[parsed.type]}. Calcolo lo studio di funzione su f(x) = ${parsed.node.toString()}.`;
  el.detectedBanner.hidden = false;

  try {
    startComputed(parsed);
  } catch (e) {
    if (e.message === 'UNSUPPORTED_IRRATIONAL_FORM') {
      showError('Per ora supportiamo funzioni irrazionali nella forma √g(x) (radice quadrata di un’espressione razionale). Riscrivi la funzione in questa forma, oppure lascia il campo vuoto per un esempio guidato.');
    } else {
      console.error(e);
      showError('Non è stato possibile analizzare questa funzione: prova a semplificarla, oppure lascia il campo vuoto per un esempio guidato.');
    }
  }
});

el.prevBtn.addEventListener('click', () => {
  if (state && state.currentIndex > 0) {
    state.currentIndex--;
    renderCurrentStep();
  }
});

el.nextBtn.addEventListener('click', () => {
  if (state && state.currentIndex < state.steps.length - 1) {
    state.currentIndex++;
    renderCurrentStep();
  }
});

el.restartBtn.addEventListener('click', () => {
  state = null;
  hideBanners();
  el.input.value = '';
  el.study.hidden = true;
  el.setup.hidden = false;
  el.setup.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
