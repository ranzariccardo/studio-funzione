// irrational.js — gli 8 passi dello studio di funzione per funzioni del tipo
// f(x) = sqrt(g(x)), con g razionale (polinomiale o fratta). E' il caso
// classico affrontato al liceo prima delle forme irrazionali composte.
// Ogni passo mostra sempre teoria + domanda ("prompt"); la risposta viene
// rivelata dall'utente con un bottone (vedi js/ui/steps.js), e solo allora
// le sue graphOps vengono aggiunte al grafico (gestito da js/app.js).

import { rationalToCoefficients, extractSqrtRadicand, compile, toLatex, round } from './parser.js';
import { realRootsPoly, signIntervals, numericRealRoots, polyDegree, clipIntervals, complementIntervals } from './roots.js';
import { IRRATIONAL_THEORY } from '../theory.js';

const EPS = 1e-4;
const RANGE = { from: -30, to: 30 };
const VIEW_DOMAIN = { from: -10, to: 10 };

function fmtNum(x) {
  return `${round(x, 4)}`;
}

export function computeSteps({ node }) {
  const radicandNode = extractSqrtRadicand(node);
  if (!radicandNode) {
    throw new Error('UNSUPPORTED_IRRATIONAL_FORM');
  }

  const { numerator, denominator } = rationalToCoefficients(radicandNode);
  const gFn = compile(radicandNode);
  const fn = compile(node);
  const isFraction = polyDegree(denominator) > 0;

  const numRoots = realRootsPoly(numerator);
  const denomRoots = isFraction ? realRootsPoly(denominator) : [];
  const breakpoints = Array.from(new Set([...numRoots, ...denomRoots]));
  const gSignIntervals = signIntervals(gFn, breakpoints, RANGE);
  const domainIntervals = gSignIntervals.filter((iv) => iv.sign >= 0);

  const steps = [];
  steps.push(domainStep({ domainIntervals, denomRoots, isFraction }));
  steps.push(symmetryStep({ numerator }));
  steps.push(intersectionsStep({ numRoots, fn, domainIntervals }));
  steps.push(signStep({ numRoots, domainIntervals }));
  steps.push(limitsStep({ numerator, denominator, gFn, denomRoots, isFraction }));
  steps.push(asymptotesStep({ numerator, denominator, denomRoots, isFraction }));
  steps.push(monotonicityStep({ node, fn }));
  steps.push(concavityStep({ node, fn }));

  return steps;
}

function domainStep({ domainIntervals, denomRoots, isFraction }) {
  const prompt = [
    'Osserva la funzione prima di calcolare: è una radice quadrata, f(x) = √g(x).',
    'Vincolo da imporre: il radicando deve essere maggiore o uguale a zero (una radice quadrata non è definita per valori negativi).',
  ];
  if (isFraction) {
    prompt.push('Il radicando g(x) è a sua volta una frazione: anche il suo denominatore deve essere diverso da zero.');
  }
  prompt.push('Prova a stabilire da solo per quali x vale questo vincolo.');

  const parts = domainIntervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    return `[${fromLabel}, ${toLabel}]`;
  });

  const acceptedClipped = clipIntervals(domainIntervals, VIEW_DOMAIN);
  const rejectedClipped = complementIntervals(acceptedClipped, VIEW_DOMAIN);

  const graphOps = [
    ...acceptedClipped.map((iv) => ({ type: 'domainBand', from: iv.from, to: iv.to })),
    ...rejectedClipped.map((iv) => ({ type: 'domainBandExcluded', from: iv.from, to: iv.to })),
  ];
  denomRoots.forEach((x) => graphOps.push({ type: 'exclude', x }));

  return {
    key: 'domain',
    title: '1. Dominio',
    theory: IRRATIONAL_THEORY.domain,
    prompt,
    answer: [
      parts.length ? `Dominio: ${parts.join(' ∪ ')}.` : 'Il dominio risulta vuoto per questa funzione.',
    ],
    formulas: [],
    graphOps,
  };
}

function symmetryStep({ numerator }) {
  const n = numerator.length - 1;
  const neg = numerator.map((c, i) => (((n - i) % 2 === 0) ? c : -c));
  const isEven = neg.every((v, i) => Math.abs(v - numerator[i]) < 1e-6);

  const answer = [isEven
    ? 'Il radicando è una funzione pari: anche f(x) = √g(x) è pari (simmetrica rispetto all’asse y).'
    : 'La funzione non è né pari né dispari.'];

  return {
    key: 'symmetry',
    title: '2. Simmetrie',
    theory: IRRATIONAL_THEORY.symmetry,
    prompt: ['Prova a stabilire da solo se questa funzione è pari, dispari o nessuna delle due: guarda se il radicando g(x) è una funzione pari.'],
    answer,
    formulas: [],
    graphOps: [],
  };
}

function intersectionsStep({ numRoots, fn, domainIntervals }) {
  const answer = [];
  const graphOps = [];

  const zeroInDomain = domainIntervals.some((iv) => iv.from <= 0 && 0 <= iv.to);
  if (zeroInDomain) {
    const y0 = fn(0);
    if (Number.isFinite(y0)) {
      answer.push(`Intersezione con l’asse y: (0, ${fmtNum(y0)}).`);
      graphOps.push({ type: 'point', x: 0, y: y0, label: `(0, ${fmtNum(y0)})` });
    }
  } else {
    answer.push('x = 0 non appartiene al dominio: nessuna intersezione con l’asse y.');
  }

  const inDomainRoots = numRoots.filter((r) => domainIntervals.some((iv) => iv.from - 1e-6 <= r && r <= iv.to + 1e-6));
  if (inDomainRoots.length) {
    const list = inDomainRoots.map(fmtNum).join(', ');
    answer.push(`Intersezioni con l’asse x: x = ${list}.`);
    inDomainRoots.forEach((x) => graphOps.push({ type: 'point', x, y: 0, label: `(${fmtNum(x)}, 0)` }));
  } else {
    answer.push('Nessuna intersezione con l’asse x.');
  }

  return {
    key: 'intersections',
    title: '3. Intersezioni con gli assi',
    theory: IRRATIONAL_THEORY.intersections,
    prompt: ['Prova a calcolare tu l’intersezione con l’asse y (calcola f(0), se 0 appartiene al dominio) e le intersezioni con l’asse x (risolvi g(x) = 0, controllando che siano nel dominio).'],
    answer,
    formulas: [],
    graphOps,
  };
}

function signStep({ numRoots, domainIntervals }) {
  const answer = ['f(x) = √g(x) è sempre ≥ 0 dove è definita (per definizione di radice quadrata).'];
  if (numRoots.length) {
    const inDomain = numRoots.filter((r) => domainIntervals.some((iv) => iv.from - 1e-6 <= r && r <= iv.to + 1e-6));
    if (inDomain.length) {
      answer.push(`f(x) = 0 per x = ${inDomain.map(fmtNum).join(', ')}; altrove f(x) > 0.`);
    }
  }
  return {
    key: 'sign',
    title: '4. Segno della funzione',
    theory: IRRATIONAL_THEORY.sign,
    prompt: ['Ricorda: una radice quadrata è sempre ≥ 0. Prova a stabilire tu dove f(x) = 0 (dove si annulla il radicando).'],
    answer,
    formulas: [],
    graphOps: [],
  };
}

function limitsStep({ numerator, denominator, gFn, denomRoots, isFraction }) {
  const answer = [];

  denomRoots.forEach((x) => {
    const right = gFn(x + EPS);
    const left = gFn(x - EPS);
    const rightOk = Number.isFinite(right) && right > 0;
    const leftOk = Number.isFinite(left) && left > 0;
    if (rightOk) answer.push(`Per x → ${fmtNum(x)}⁺: f(x) → +∞.`);
    if (leftOk) answer.push(`Per x → ${fmtNum(x)}⁻: f(x) → +∞.`);
  });

  const leadRatio = numerator[0] / (isFraction ? denominator[0] : 1);

  if (isFraction) {
    if (polyDegree(numerator) < polyDegree(denominator)) {
      answer.push('Per x → ±∞: g(x) → 0, quindi f(x) → 0 (asintoto orizzontale y = 0).');
    } else if (polyDegree(numerator) === polyDegree(denominator)) {
      const L = leadRatio;
      answer.push(L >= 0
        ? `Per x → ±∞: f(x) → √${fmtNum(L)} = ${fmtNum(Math.sqrt(L))}.`
        : 'Per x → ±∞: g(x) diventa negativo, quella zona è fuori dal dominio.');
    } else {
      answer.push('Per x → ±∞: g(x) → +∞ (se il coefficiente direttivo è positivo), quindi f(x) → +∞.');
    }
  } else {
    if (leadRatio > 0) {
      answer.push('Per x → ±∞: g(x) → +∞, quindi f(x) → +∞.');
    } else {
      answer.push('Per x → ±∞: g(x) → -∞, quella zona è fuori dal dominio.');
    }
  }

  return {
    key: 'limits',
    title: '5. Limiti agli estremi del dominio',
    theory: IRRATIONAL_THEORY.limits,
    prompt: ['Prova a calcolare tu il comportamento di f(x) ai bordi del dominio e, se il dominio è illimitato, per x → ±∞.'],
    answer,
    formulas: [],
    graphOps: [],
  };
}

function asymptotesStep({ numerator, denominator, denomRoots, isFraction }) {
  const answer = [];
  const graphOps = [];

  denomRoots.forEach((x) => {
    answer.push(`Asintoto verticale: x = ${fmtNum(x)}.`);
    graphOps.push({ type: 'asymptoteV', x });
  });

  if (isFraction && polyDegree(numerator) === polyDegree(denominator)) {
    const L = numerator[0] / denominator[0];
    if (L >= 0) {
      const y = Math.sqrt(L);
      answer.push(`Asintoto orizzontale: y = ${fmtNum(y)}.`);
      graphOps.push({ type: 'asymptoteH', y });
    }
  } else if (isFraction && polyDegree(numerator) < polyDegree(denominator)) {
    answer.push('Asintoto orizzontale: y = 0.');
    graphOps.push({ type: 'asymptoteH', y: 0 });
  }

  if (!isFraction && polyDegree(numerator) === 2) {
    // caso classico: g(x) = a x^2 + b x + c, f(x) = sqrt(g(x)) ~ retta obliqua
    const [a, b] = numerator;
    if (a > 0) {
      const sq = Math.sqrt(a);
      const q = b / (2 * sq);
      answer.push(`Per x → +∞: asintoto obliquo y = ${fmtNum(sq)}x + ${fmtNum(q)}.`);
      answer.push(`Per x → -∞: asintoto obliquo y = ${fmtNum(-sq)}x - ${fmtNum(q)}.`);
      graphOps.push({ type: 'asymptoteO', m: sq, q });
      graphOps.push({ type: 'asymptoteO', m: -sq, q: -q });
    }
  }

  if (!answer.length) answer.push('Non ci sono asintoti.');

  return {
    key: 'asymptotes',
    title: '6. Asintoti',
    theory: IRRATIONAL_THEORY.asymptotes,
    prompt: ['In base ai limiti appena calcolati, prova a dedurre tu se ci sono asintoti verticali, orizzontali o obliqui.'],
    answer,
    formulas: [],
    graphOps,
  };
}

function monotonicityStep({ node, fn }) {
  const derivativeNode = math.derivative(node, 'x');
  const derivativeFn = compile(derivativeNode);

  const criticalPoints = numericRealRoots(derivativeFn, RANGE);
  const intervals = signIntervals(derivativeFn, criticalPoints, RANGE);

  const answer = intervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    const verdict = iv.sign > 0 ? 'crescente' : iv.sign < 0 ? 'decrescente' : 'costante';
    return `Per ${fromLabel} < x < ${toLabel} (dove definita): f(x) è ${verdict}.`;
  });

  const graphOps = [];
  criticalPoints.forEach((x) => {
    const before = intervals.find((iv) => Math.abs(iv.to - x) < 1e-6);
    const after = intervals.find((iv) => Math.abs(iv.from - x) < 1e-6);
    let kind = null;
    if (before && after) {
      if (before.sign > 0 && after.sign < 0) kind = 'max';
      else if (before.sign < 0 && after.sign > 0) kind = 'min';
    }
    if (kind) {
      const y = fn(x);
      if (Number.isFinite(y)) {
        answer.push(`x = ${fmtNum(x)} è un punto di ${kind === 'max' ? 'massimo' : 'minimo'} relativo (f(${fmtNum(x)}) = ${fmtNum(y)}).`);
        graphOps.push({ type: 'extremum', x, y, kind });
      }
    }
  });

  return {
    key: 'monotonicity',
    title: '7. Derivata prima: crescenza e decrescenza',
    theory: IRRATIONAL_THEORY.monotonicity,
    prompt: ['Prova a calcolare tu la derivata prima (regola della catena: g\'(x) / (2√g(x))) e a studiarne il segno.'],
    answer,
    formulas: [`f'(x) = ${toLatexSafe(derivativeNode)}`],
    graphOps,
  };
}

function concavityStep({ node, fn }) {
  const d1 = math.derivative(node, 'x');
  const d2 = math.derivative(d1, 'x');
  const secondFn = compile(d2);

  const inflectionCandidates = numericRealRoots(secondFn, RANGE);
  const intervals = signIntervals(secondFn, inflectionCandidates, RANGE);

  const answer = intervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    const verdict = iv.sign > 0 ? 'concava verso l’alto (convessa)' : iv.sign < 0 ? 'concava verso il basso' : 'a curvatura nulla';
    return `Per ${fromLabel} < x < ${toLabel} (dove definita): f(x) è ${verdict}.`;
  });

  const graphOps = [];
  inflectionCandidates.forEach((x) => {
    const y = fn(x);
    if (Number.isFinite(y)) {
      answer.push(`x = ${fmtNum(x)} è un punto di flesso (f(${fmtNum(x)}) = ${fmtNum(y)}).`);
      graphOps.push({ type: 'point', x, y, label: 'flesso' });
    }
  });

  return {
    key: 'concavity',
    title: '8. Derivata seconda: concavità e flessi',
    theory: IRRATIONAL_THEORY.concavity,
    prompt: ['Prova a calcolare tu la derivata seconda e a studiarne il segno per dedurre la concavità e i punti di flesso.'],
    answer,
    formulas: [`f''(x) = ${toLatexSafe(d2)}`],
    graphOps,
    revealsCurve: true,
  };
}

function toLatexSafe(node) {
  try {
    return toLatex(node);
  } catch (e) {
    return node.toString();
  }
}
