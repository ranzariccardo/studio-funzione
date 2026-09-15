// rational.js — i 7 passi dello studio di funzione per funzioni razionali
// (polinomiali o fratte), calcolati sulla funzione specifica dell'utente.

import { rationalToCoefficients, formatPolyLatex, compile, toLatex, round } from './parser.js';
import { realRootsPoly, evaluatePoly, signIntervals, numericRealRoots, polyDegree } from './roots.js';
import { RATIONAL_THEORY } from '../theory.js';

const EPS = 1e-4;
const RANGE = { from: -30, to: 30 };

function arraysApproxEqual(a, b, tol = 1e-6) {
  const len = Math.max(a.length, b.length);
  const pad = (arr) => Array(len - arr.length).fill(0).concat(arr);
  const pa = pad(a), pb = pad(b);
  return pa.every((v, i) => Math.abs(v - pb[i]) < tol);
}

function substituteNegX(coeffs) {
  const n = coeffs.length - 1;
  return coeffs.map((c, i) => ((n - i) % 2 === 0 ? c : -c));
}

function parity(coeffs) {
  const neg = substituteNegX(coeffs);
  if (arraysApproxEqual(neg, coeffs)) return 'even';
  if (arraysApproxEqual(neg, coeffs.map((c) => -c))) return 'odd';
  return 'none';
}

function fmtNum(x) {
  const r = round(x, 4);
  return Number.isInteger(r) ? `${r}` : `${r}`;
}

function containsRoot(roots, x, tol = 1e-3) {
  return roots.some((r) => Math.abs(r - x) < tol);
}

function fmtLinearX(m) {
  if (Math.abs(m - 1) < 1e-9) return 'x';
  if (Math.abs(m + 1) < 1e-9) return '-x';
  return `${fmtNum(m)}x`;
}

function fmtLine(m, q) {
  const xTerm = fmtLinearX(m);
  if (Math.abs(q) < 1e-9) return xTerm;
  return q > 0 ? `${xTerm} + ${fmtNum(q)}` : `${xTerm} - ${fmtNum(Math.abs(q))}`;
}

export function computeSteps({ node }) {
  const { numerator, denominator } = rationalToCoefficients(node);
  const fn = compile(node);
  const isFraction = polyDegree(denominator) > 0;

  const denomRoots = isFraction ? realRootsPoly(denominator) : [];
  const numRoots = realRootsPoly(numerator);
  const holes = denomRoots.filter((c) => containsRoot(numRoots, c));
  const verticalCandidates = denomRoots.filter((c) => !containsRoot(holes, c));

  const steps = [];
  steps.push(domainStep({ denomRoots, isFraction }));
  steps.push(symmetryStep({ numerator, denominator, fn, denomRoots }));
  steps.push(signStep({ numerator, denominator, fn, numRoots, denomRoots }));

  const limitsData = computeLimitsAndAsymptotes({ numerator, denominator, fn, verticalCandidates });
  steps.push(limitsStep(limitsData));
  steps.push(asymptotesStep(limitsData));
  steps.push(monotonicityStep({ node, fn, denomRoots }));
  steps.push(concavityStep({ node, fn, denomRoots }));

  return steps;
}

function domainStep({ denomRoots, isFraction }) {
  const graphOps = [];
  let text;
  if (!isFraction || denomRoots.length === 0) {
    text = ['Il denominatore non si annulla mai (o la funzione è un polinomio): il dominio è tutto ℝ.'];
  } else {
    const sorted = denomRoots.slice().sort((a, b) => a - b);
    const list = sorted.map(fmtNum).join(', ');
    text = [
      `Il denominatore si annulla per x = ${list}: questi valori vanno esclusi dal dominio.`,
      `Dominio: ℝ \\ {${list}}.`,
    ];
    sorted.forEach((x) => graphOps.push({ type: 'exclude', x }));
  }
  return {
    key: 'domain',
    title: '1. Dominio',
    theory: RATIONAL_THEORY.domain,
    text,
    formulas: [],
    graphOps,
  };
}

function symmetryStep({ numerator, denominator, fn, denomRoots }) {
  const parN = parity(numerator);
  const parD = parity(denominator);
  let symmetryText;
  if (parN !== 'none' && parD !== 'none') {
    const overall = parN === parD ? 'even' : 'odd';
    symmetryText = overall === 'even'
      ? 'f(-x) = f(x): la funzione è pari (simmetrica rispetto all’asse y).'
      : 'f(-x) = -f(x): la funzione è dispari (simmetrica rispetto all’origine).';
  } else {
    symmetryText = 'La funzione non è né pari né dispari.';
  }

  const graphOps = [];
  const text = [symmetryText];

  if (!denomRoots.some((r) => Math.abs(r) < 1e-6)) {
    const y0 = fn(0);
    if (Number.isFinite(y0)) {
      text.push(`Intersezione con l’asse y: (0, ${fmtNum(y0)}).`);
      graphOps.push({ type: 'point', x: 0, y: y0, label: '(0, ' + fmtNum(y0) + ')' });
    }
  }

  const numRoots = realRootsPoly(numerator).filter((r) => !denomRoots.some((d) => Math.abs(d - r) < 1e-3));
  if (numRoots.length) {
    const list = numRoots.map(fmtNum).join(', ');
    text.push(`Intersezioni con l’asse x: x = ${list}.`);
    numRoots.forEach((x) => graphOps.push({ type: 'point', x, y: 0, label: `(${fmtNum(x)}, 0)` }));
  } else {
    text.push('Nessuna intersezione con l’asse x.');
  }

  return {
    key: 'symmetry',
    title: '2. Simmetrie e intersezioni con gli assi',
    theory: RATIONAL_THEORY.symmetry,
    text,
    formulas: [],
    graphOps,
  };
}

function signStep({ fn, numRoots, denomRoots }) {
  const breakpoints = Array.from(new Set([...numRoots, ...denomRoots]));
  const intervals = signIntervals(fn, breakpoints, RANGE);
  const text = intervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    const verdict = iv.sign > 0 ? 'f(x) > 0' : iv.sign < 0 ? 'f(x) < 0' : 'f(x) = 0';
    return `Per ${fromLabel} < x < ${toLabel}: ${verdict}.`;
  });

  return {
    key: 'sign',
    title: '3. Segno della funzione',
    theory: RATIONAL_THEORY.sign,
    text: text.length ? text : ['Non è stato possibile determinare il segno in modo automatico.'],
    formulas: [],
    graphOps: [],
  };
}

function computeLimitsAndAsymptotes({ numerator, denominator, fn, verticalCandidates }) {
  const degN = polyDegree(numerator);
  const degD = polyDegree(denominator);
  const leadN = numerator[0];
  const leadD = denominator[0];

  const verticals = verticalCandidates.map((x) => {
    const left = fn(x - EPS);
    const right = fn(x + EPS);
    return {
      x,
      leftSign: Number.isFinite(left) ? Math.sign(left) : 0,
      rightSign: Number.isFinite(right) ? Math.sign(right) : 0,
    };
  }).sort((a, b) => a.x - b.x);

  let horizontal = null;
  let oblique = null;
  let infiniteBehaviorNote = null;

  if (degN < degD) {
    horizontal = { y: 0 };
  } else if (degN === degD) {
    horizontal = { y: round(leadN / leadD, 4) };
  } else if (degN === degD + 1) {
    const { quotient } = polyLongDivide(numerator, denominator);
    oblique = { m: round(quotient[0], 4), q: round(quotient[1] ?? 0, 4) };
  } else {
    const sign = Math.sign(leadN / leadD);
    infiniteBehaviorNote = sign;
  }

  return { degN, degD, verticals, horizontal, oblique, infiniteBehaviorNote };
}

function polyLongDivide(numerator, denominator) {
  let remainder = numerator.slice();
  const quotient = [];
  const dLead = denominator[0];
  const dDeg = denominator.length - 1;

  while (remainder.length - 1 >= dDeg && remainder.length > 1) {
    const coeff = remainder[0] / dLead;
    quotient.push(coeff);
    for (let i = 0; i < denominator.length; i++) {
      remainder[i] -= coeff * denominator[i];
    }
    remainder.shift();
  }

  return { quotient, remainder };
}

function limitsStep({ verticals, horizontal, oblique, infiniteBehaviorNote, degN, degD }) {
  const text = [];

  verticals.forEach((v) => {
    const leftArrow = v.leftSign > 0 ? '+∞' : '-∞';
    const rightArrow = v.rightSign > 0 ? '+∞' : '-∞';
    text.push(`Per x → ${fmtNum(v.x)}⁻: f(x) → ${leftArrow}.  Per x → ${fmtNum(v.x)}⁺: f(x) → ${rightArrow}.`);
  });

  if (horizontal) {
    text.push(`Per x → ±∞: f(x) → ${fmtNum(horizontal.y)}.`);
  } else if (oblique) {
    text.push(`Per x → ±∞: f(x) si comporta come la retta y = ${fmtLine(oblique.m, oblique.q)}.`);
  } else if (infiniteBehaviorNote !== null) {
    text.push(`Per x → ±∞: f(x) → ±∞ (il grado del numeratore supera di più di 1 quello del denominatore).`);
  }

  if (!verticals.length && !horizontal && !oblique && infiniteBehaviorNote === null) {
    text.push('Nessun limite notevole da segnalare: la funzione è definita su tutto ℝ e ha comportamento regolare.');
  }

  return {
    key: 'limits',
    title: '4. Limiti agli estremi del dominio',
    theory: RATIONAL_THEORY.limits,
    text,
    formulas: [],
    graphOps: [],
  };
}

function asymptotesStep({ verticals, horizontal, oblique }) {
  const text = [];
  const graphOps = [];

  if (verticals.length) {
    text.push(`Asintoti verticali: x = ${verticals.map((v) => fmtNum(v.x)).join(', ')}.`);
    verticals.forEach((v) => graphOps.push({ type: 'asymptoteV', x: v.x }));
  }
  if (horizontal) {
    text.push(`Asintoto orizzontale: y = ${fmtNum(horizontal.y)}.`);
    graphOps.push({ type: 'asymptoteH', y: horizontal.y });
  } else if (oblique) {
    text.push(`Asintoto obliquo: y = ${fmtLine(oblique.m, oblique.q)}.`);
    graphOps.push({ type: 'asymptoteO', m: oblique.m, q: oblique.q });
  }
  if (!text.length) {
    text.push('Non ci sono asintoti.');
  }

  return {
    key: 'asymptotes',
    title: '5. Asintoti',
    theory: RATIONAL_THEORY.asymptotes,
    text,
    formulas: [],
    graphOps,
  };
}

function monotonicityStep({ node, fn, denomRoots }) {
  const derivativeNode = math.derivative(node, 'x');
  const derivativeFn = compile(derivativeNode);

  const criticalPoints = numericRealRoots((x) => {
    if (denomRoots.some((d) => Math.abs(d - x) < 1e-3)) return NaN;
    return derivativeFn(x);
  }, RANGE);

  const breakpoints = Array.from(new Set([...criticalPoints, ...denomRoots]));
  const intervals = signIntervals(derivativeFn, breakpoints, RANGE);

  const text = intervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    const verdict = iv.sign > 0 ? 'crescente' : iv.sign < 0 ? 'decrescente' : 'costante';
    return `Per ${fromLabel} < x < ${toLabel}: f(x) è ${verdict}.`;
  });

  const graphOps = [];
  criticalPoints.forEach((x) => {
    if (denomRoots.some((d) => Math.abs(d - x) < 1e-3)) return;
    const before = intervals.find((iv) => Math.abs(iv.to - x) < 1e-6);
    const after = intervals.find((iv) => Math.abs(iv.from - x) < 1e-6);
    let kind = null;
    if (before && after) {
      if (before.sign > 0 && after.sign < 0) kind = 'max';
      else if (before.sign < 0 && after.sign > 0) kind = 'min';
    }
    if (kind) {
      const y = fn(x);
      text.push(`x = ${fmtNum(x)} è un punto di ${kind === 'max' ? 'massimo' : 'minimo'} relativo (f(${fmtNum(x)}) = ${fmtNum(y)}).`);
      graphOps.push({ type: 'extremum', x, y, kind });
    }
  });

  return {
    key: 'monotonicity',
    title: '6. Derivata prima: crescenza e decrescenza',
    theory: RATIONAL_THEORY.monotonicity,
    text,
    formulas: [`f'(x) = ${toLatexSafe(derivativeNode)}`],
    graphOps,
  };
}

function concavityStep({ node, fn, denomRoots }) {
  const d1 = math.derivative(node, 'x');
  const d2 = math.derivative(d1, 'x');
  const secondFn = compile(d2);

  const inflectionCandidates = numericRealRoots((x) => {
    if (denomRoots.some((d) => Math.abs(d - x) < 1e-3)) return NaN;
    return secondFn(x);
  }, RANGE);

  const breakpoints = Array.from(new Set([...inflectionCandidates, ...denomRoots]));
  const intervals = signIntervals(secondFn, breakpoints, RANGE);

  const text = intervals.map((iv) => {
    const fromLabel = iv.from === RANGE.from ? '-∞' : fmtNum(iv.from);
    const toLabel = iv.to === RANGE.to ? '+∞' : fmtNum(iv.to);
    const verdict = iv.sign > 0 ? 'concava verso l’alto (convessa)' : iv.sign < 0 ? 'concava verso il basso' : 'a curvatura nulla';
    return `Per ${fromLabel} < x < ${toLabel}: f(x) è ${verdict}.`;
  });

  const graphOps = [];
  inflectionCandidates.forEach((x) => {
    if (denomRoots.some((d) => Math.abs(d - x) < 1e-3)) return;
    const y = fn(x);
    if (Number.isFinite(y)) {
      text.push(`x = ${fmtNum(x)} è un punto di flesso (f(${fmtNum(x)}) = ${fmtNum(y)}).`);
      graphOps.push({ type: 'point', x, y, label: 'flesso' });
    }
  });

  return {
    key: 'concavity',
    title: '7. Derivata seconda: concavità e flessi',
    theory: RATIONAL_THEORY.concavity,
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
