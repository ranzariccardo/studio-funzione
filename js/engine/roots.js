// roots.js — ricerca radici (algebrica per gradi bassi, numerica altrimenti)
// e utilita' di segno riusate da rational.js e irrational.js.

export function trimLeadingZeros(coeffsIn) {
  const c = coeffsIn.slice();
  while (c.length > 1 && Math.abs(c[0]) < 1e-9) c.shift();
  return c;
}

export function evaluatePoly(coeffs, x) {
  return coeffs.reduce((acc, c) => acc * x + c, 0);
}

export function polyDegree(coeffsIn) {
  return trimLeadingZeros(coeffsIn).length - 1;
}

function bisect(fn, a, b, iterations = 60) {
  let fa = fn(a);
  for (let i = 0; i < iterations; i++) {
    const m = (a + b) / 2;
    const fm = fn(m);
    if ((fa < 0 && fm >= 0) || (fa > 0 && fm <= 0)) {
      b = m;
    } else {
      a = m;
      fa = fm;
    }
  }
  return (a + b) / 2;
}

// ricerca radici reali di una funzione qualunque per campionamento + bisezione.
// usata sia come fallback per polinomi di grado alto, sia per derivate
// (che dopo la regola del quoziente non sono piu' polinomi puliti).
export function numericRealRoots(fn, { from = -60, to = 60, samples = 6000 } = {}) {
  const roots = [];
  const step = (to - from) / samples;
  let prevX = from;
  let prevY = safeEval(fn, prevX);

  for (let i = 1; i <= samples; i++) {
    const x = from + i * step;
    const y = safeEval(fn, x);
    if (Number.isFinite(prevY) && Number.isFinite(y)) {
      if (Math.abs(y) < 1e-6) {
        roots.push(x);
      } else if (prevY * y < 0) {
        roots.push(bisect(fn, prevX, x));
      }
    }
    prevX = x;
    prevY = y;
  }

  return dedupSorted(roots);
}

function safeEval(fn, x) {
  try {
    const y = fn(x);
    return Number.isFinite(y) ? y : NaN;
  } catch (e) {
    return NaN;
  }
}

function dedupSorted(values, tolerance = 1e-4) {
  const sorted = values.slice().sort((a, b) => a - b);
  const out = [];
  for (const v of sorted) {
    if (!out.length || Math.abs(out[out.length - 1] - v) > tolerance) out.push(v);
  }
  return out;
}

export function realRootsPoly(coeffsIn) {
  const coeffs = trimLeadingZeros(coeffsIn);
  const n = coeffs.length - 1;
  if (n <= 0) return [];

  if (n === 1) {
    const [a, b] = coeffs;
    return [-b / a];
  }

  if (n === 2) {
    const [a, b, c] = coeffs;
    const disc = b * b - 4 * a * c;
    if (disc < -1e-9) return [];
    if (Math.abs(disc) < 1e-9) return [-b / (2 * a)];
    const sq = Math.sqrt(disc);
    return [(-b - sq) / (2 * a), (-b + sq) / (2 * a)].sort((x, y) => x - y);
  }

  return numericRealRoots(x => evaluatePoly(coeffs, x));
}

export function signAt(fn, x) {
  const y = safeEval(fn, x);
  if (!Number.isFinite(y) || Math.abs(y) < 1e-7) return 0;
  return y > 0 ? 1 : -1;
}

// costruisce gli intervalli di segno di fn dati dei punti di rottura
// (radici + punti esclusi dal dominio). from/to definiscono il range visibile.
export function signIntervals(fn, breakpoints, { from = -60, to = 60 } = {}) {
  const pts = Array.from(new Set([from, ...breakpoints.filter(b => b > from && b < to), to]))
    .sort((a, b) => a - b);
  const intervals = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const mid = (a + b) / 2;
    intervals.push({ from: a, to: b, sign: signAt(fn, mid) });
  }
  return intervals;
}
