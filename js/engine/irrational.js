// irrational.js — i 7 passi dello studio di funzione per funzioni del tipo
// f(x) = sqrt(g(x)), con g razionale (polinomiale o fratta). E' il caso
// classico affrontato al liceo prima delle forme irrazionali composte.

import { rationalToCoefficients, extractSqrtRadicand, compile, toLatex, round } from './parser.js';
import { realRootsPoly, signIntervals, numericRealRoots, polyDegree } from './roots.js';
import { IRRATIONAL_THEORY } from '../theory.js';

const EPS = 1e-4;
const RANGE = { from: -30, to: 30 };

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
  steps.push(domainStep({ domainIntervals, denomRoots }));
  steps.push(symmetryStep({ numerator, fn, domainIntervals }));
  steps.push(signStep({ numRoots, domainIntervals }));
  steps.push(limitsStep({ numerator, denominator, gFn, denomRoots, isFraction }));
  steps.push(asymptotesStep({ numerator, denominator, denomRoots, isFraction }));
  steps.push(monotonicityStep({ node, fn }));
  steps.push(concavityStep({ node, fn }));

  return steps;
}

function domainStep({ domainIntervals, denomRoots }) {
  const graphOps = [];
  const parts = domainIntervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    return `[${fromLabel}, ${toLabel}]`;
  });

  denomRoots.forEach((x) => graphOps.push({ type: 'exclude', x }));

  return {
    key: 'domain',
    title: '1. Dominio',
    theory: IRRATIONAL_THEORY.domain,
    text: [
      'La quantità sotto radice deve essere maggiore o uguale a zero (e il denominatore, se presente, diverso da zero).',
      parts.length ? `Dominio: ${parts.join(' ∪ ')}.` : 'Il dominio risulta vuoto per questa funzione.',
    ],
    formulas: [],
    graphOps,
  };
}

function symmetryStep({ numerator, fn, domainIntervals }) {
  const n = numerator.length - 1;
  const neg = numerator.map((c, i) => (((n - i) % 2 === 0) ? c : -c));
  const isEven = neg.every((v, i) => Math.abs(v - numerator[i]) < 1e-6);

  const text = [isEven
    ? 'Il radicando è una funzione pari: anche f(x) = √g(x) è pari (simmetrica rispetto all’asse y).'
    : 'La funzione non è né pari né dispari.'];

  const graphOps = [];
  const zeroInDomain = domainIntervals.some((iv) => iv.from <= 0 && 0 <= iv.to);
  if (zeroInDomain) {
    const y0 = fn(0);
    if (Number.isFinite(y0)) {
      text.push(`Intersezione con l’asse y: (0, ${fmtNum(y0)}).`);
      graphOps.push({ type: 'point', x: 0, y: y0, label: `(0, ${fmtNum(y0)})` });
    }
  }

  return {
    key: 'symmetry',
    title: '2. Simmetrie e intersezioni con gli assi',
    theory: IRRATIONAL_THEORY.symmetry,
    text,
    formulas: [],
    graphOps,
  };
}

function signStep({ numRoots, domainIntervals }) {
  const text = ['f(x) = √g(x) è sempre ≥ 0 dove è definita (per definizione di radice quadrata).'];
  if (numRoots.length) {
    const inDomain = numRoots.filter((r) => domainIntervals.some((iv) => iv.from - 1e-6 <= r && r <= iv.to + 1e-6));
    if (inDomain.length) {
      text.push(`f(x) = 0 per x = ${inDomain.map(fmtNum).join(', ')}; altrove f(x) > 0.`);
    }
  }
  return {
    key: 'sign',
    title: '3. Segno della funzione',
    theory: IRRATIONAL_THEORY.sign,
    text,
    formulas: [],
    graphOps: [],
  };
}

function limitsStep({ numerator, denominator, gFn, denomRoots, isFraction }) {
  const text = [];

  denomRoots.forEach((x) => {
    const right = gFn(x + EPS);
    const left = gFn(x - EPS);
    const rightOk = Number.isFinite(right) && right > 0;
    const leftOk = Number.isFinite(left) && left > 0;
    if (rightOk) text.push(`Per x → ${fmtNum(x)}⁺: f(x) → +∞.`);
    if (leftOk) text.push(`Per x → ${fmtNum(x)}⁻: f(x) → +∞.`);
  });

  const degG = polyDegree(numerator) - (isFraction ? polyDegree(denominator) : 0);
  const leadRatio = numerator[0] / (isFraction ? denominator[0] : 1);

  if (isFraction) {
    if (polyDegree(numerator) < polyDegree(denominator)) {
      text.push('Per x → ±∞: g(x) → 0, quindi f(x) → 0 (asintoto orizzontale y = 0).');
    } else if (polyDegree(numerator) === polyDegree(denominator)) {
      const L = leadRatio;
      text.push(L >= 0
        ? `Per x → ±∞: f(x) → √${fmtNum(L)} = ${fmtNum(Math.sqrt(L))}.`
        : 'Per x → ±∞: g(x) diventa negativo, quella zona è fuori dal dominio.');
    } else {
      text.push('Per x → ±∞: g(x) → +∞ (se il coefficiente direttivo è positivo), quindi f(x) → +∞.');
    }
  } else {
    if (leadRatio > 0) {
      text.push('Per x → ±∞: g(x) → +∞, quindi f(x) → +∞.');
    } else {
      text.push('Per x → ±∞: g(x) → -∞, quella zona è fuori dal dominio.');
    }
  }

  return {
    key: 'limits',
    title: '4. Limiti agli estremi del dominio',
    theory: IRRATIONAL_THEORY.limits,
    text,
    formulas: [],
    graphOps: [],
  };
}

function asymptotesStep({ numerator, denominator, denomRoots, isFraction }) {
  const text = [];
  const graphOps = [];

  denomRoots.forEach((x) => {
    text.push(`Asintoto verticale: x = ${fmtNum(x)}.`);
    graphOps.push({ type: 'asymptoteV', x });
  });

  if (isFraction && polyDegree(numerator) === polyDegree(denominator)) {
    const L = numerator[0] / denominator[0];
    if (L >= 0) {
      const y = Math.sqrt(L);
      text.push(`Asintoto orizzontale: y = ${fmtNum(y)}.`);
      graphOps.push({ type: 'asymptoteH', y });
    }
  } else if (isFraction && polyDegree(numerator) < polyDegree(denominator)) {
    text.push('Asintoto orizzontale: y = 0.');
    graphOps.push({ type: 'asymptoteH', y: 0 });
  }

  if (!isFraction && polyDegree(numerator) === 2) {
    // caso classico: g(x) = a x^2 + b x + c, f(x) = sqrt(g(x)) ~ retta obliqua
    const [a, b] = numerator;
    if (a > 0) {
      const sq = Math.sqrt(a);
      const q = b / (2 * sq);
      text.push(`Per x → +∞: asintoto obliquo y = ${fmtNum(sq)}x + ${fmtNum(q)}.`);
      text.push(`Per x → -∞: asintoto obliquo y = ${fmtNum(-sq)}x - ${fmtNum(q)}.`);
      graphOps.push({ type: 'asymptoteO', m: sq, q });
      graphOps.push({ type: 'asymptoteO', m: -sq, q: -q });
    }
  }

  if (!text.length) text.push('Non ci sono asintoti.');

  return {
    key: 'asymptotes',
    title: '5. Asintoti',
    theory: IRRATIONAL_THEORY.asymptotes,
    text,
    formulas: [],
    graphOps,
  };
}

function monotonicityStep({ node, fn }) {
  const derivativeNode = math.derivative(node, 'x');
  const derivativeFn = compile(derivativeNode);

  const criticalPoints = numericRealRoots(derivativeFn, RANGE);
  const intervals = signIntervals(derivativeFn, criticalPoints, RANGE);

  const text = intervals.map((iv) => {
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
        text.push(`x = ${fmtNum(x)} è un punto di ${kind === 'max' ? 'massimo' : 'minimo'} relativo (f(${fmtNum(x)}) = ${fmtNum(y)}).`);
        graphOps.push({ type: 'extremum', x, y, kind });
      }
    }
  });

  return {
    key: 'monotonicity',
    title: '6. Derivata prima: crescenza e decrescenza',
    theory: IRRATIONAL_THEORY.monotonicity,
    text,
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

  const text = intervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    const verdict = iv.sign > 0 ? 'concava verso l’alto (convessa)' : iv.sign < 0 ? 'concava verso il basso' : 'a curvatura nulla';
    return `Per ${fromLabel} < x < ${toLabel} (dove definita): f(x) è ${verdict}.`;
  });

  const graphOps = [];
  inflectionCandidates.forEach((x) => {
    const y = fn(x);
    if (Number.isFinite(y)) {
      text.push(`x = ${fmtNum(x)} è un punto di flesso (f(${fmtNum(x)}) = ${fmtNum(y)}).`);
      graphOps.push({ type: 'point', x, y, label: 'flesso' });
    }
  });

  return {
    key: 'concavity',
    title: '7. Derivata seconda: concavità e flessi',
    theory: IRRATIONAL_THEORY.concavity,
    text,
    formulas: [`f''(x) = ${toLatexSafe(d2)}`],
    graphOps,
  };
}

function toLatexSafe(node) {
  try {
    return toLatex(node);
  } catch (e) {
    return node.toString();
  }
}
