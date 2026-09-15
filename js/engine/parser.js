// parser.js — parsing dell'espressione utente (via math.js), riconoscimento
// del tipo di funzione, ed estrazione dei coefficienti polinomiali.

const TRANSCENDENTAL_FUNCTIONS = [
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'asin', 'acos', 'atan',
  'exp', 'log', 'log10', 'log2',
];

// MathLive (tastiera matematica) esporta in ascii-math nomi che math.js non
// riconosce come funzioni built-in (es. "arcsin" invece di "asin", "ln"
// invece di "log"): li rinominiamo nell'albero subito dopo il parsing.
const FUNCTION_ALIASES = {
  arcsin: 'asin',
  arccos: 'acos',
  arctan: 'atan',
  ln: 'log',
};

function normalizeFunctionAliases(node) {
  node.traverse((n) => {
    if (n.isFunctionNode && FUNCTION_ALIASES[n.fn.name]) {
      n.fn.name = FUNCTION_ALIASES[n.fn.name];
    }
  });
  return node;
}

export function parseFunction(exprStr) {
  let node;
  try {
    node = normalizeFunctionAliases(math.parse(exprStr));
  } catch (e) {
    return { error: 'Espressione non valida: controlla la sintassi (es. usa * per moltiplicare, ^ per le potenze).' };
  }

  const symbols = new Set();
  node.traverse((n, path, parent) => {
    if (!n.isSymbolNode || n.name === 'x') return;
    if (parent && parent.isFunctionNode && parent.fn === n) return; // nome di funzione (es. sqrt), non una variabile
    symbols.add(n.name);
  });
  if (symbols.size > 0) {
    return { error: `Per ora sono ammesse solo funzioni nella variabile x (trovato: ${[...symbols].join(', ')}).` };
  }

  let hasTranscendental = false;
  let hasSqrt = false;
  let hasDivision = false;

  node.traverse((n) => {
    if (n.isFunctionNode) {
      const name = n.fn.name;
      if (TRANSCENDENTAL_FUNCTIONS.includes(name)) hasTranscendental = true;
      if (name === 'sqrt') hasSqrt = true;
    }
    if (n.isOperatorNode && n.fn === 'divide') hasDivision = true;
  });

  let type;
  if (hasTranscendental) type = 'composite';
  else if (hasSqrt) type = 'irrational';
  else if (hasDivision) type = 'rational-fraction';
  else type = 'rational-poly';

  return { node, type, exprStr };
}

export function toLatex(node) {
  return node.toTex({ parenthesis: 'auto' });
}

export function compile(node) {
  const compiled = node.compile();
  return (x) => compiled.evaluate({ x });
}

// --- estrazione coefficienti polinomiali -----------------------------------

function pad(coeffs, len) {
  return Array(len - coeffs.length).fill(0).concat(coeffs);
}

function addPoly(a, b) {
  const len = Math.max(a.length, b.length);
  const pa = pad(a, len);
  const pb = pad(b, len);
  return pa.map((v, i) => v + pb[i]);
}

function subPoly(a, b) {
  const len = Math.max(a.length, b.length);
  const pa = pad(a, len);
  const pb = pad(b, len);
  return pa.map((v, i) => v - pb[i]);
}

function mulPoly(a, b) {
  const result = Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result[i + j] += a[i] * b[j];
    }
  }
  return result;
}

function negatePoly(a) {
  return a.map((v) => -v);
}

// converte un nodo che rappresenta un polinomio in x in coefficienti
// [a_n, ..., a_1, a_0] (grado decrescente). Lancia un errore se il nodo
// contiene qualcosa che non e' somma/prodotto/potenza intera di x e costanti.
export function astToCoefficients(nodeIn) {
  const node = nodeIn.isParenthesisNode ? nodeIn.content : nodeIn;

  if (node.isParenthesisNode) return astToCoefficients(node.content);

  if (node.isConstantNode) {
    return [Number(node.value)];
  }

  if (node.isSymbolNode) {
    if (node.name !== 'x') throw new Error('Variabile non riconosciuta: ' + node.name);
    return [1, 0];
  }

  if (node.isOperatorNode && node.fn === 'unaryMinus') {
    return negatePoly(astToCoefficients(node.args[0]));
  }

  if (node.isOperatorNode && (node.fn === 'add' || node.fn === 'subtract')) {
    let result = astToCoefficients(node.args[0]);
    for (let i = 1; i < node.args.length; i++) {
      const next = astToCoefficients(node.args[i]);
      result = node.fn === 'add' ? addPoly(result, next) : subPoly(result, next);
    }
    return result;
  }

  if (node.isOperatorNode && node.fn === 'multiply') {
    return node.args.map(astToCoefficients).reduce(mulPoly);
  }

  if (node.isOperatorNode && node.fn === 'divide') {
    const denomNode = node.args[1].isParenthesisNode ? node.args[1].content : node.args[1];
    if (!denomNode.isConstantNode) {
      throw new Error('Divisione non costante non attesa in un polinomio.');
    }
    const numerator = astToCoefficients(node.args[0]);
    const c = Number(denomNode.value);
    return numerator.map((v) => v / c);
  }

  if (node.isOperatorNode && node.fn === 'pow') {
    const base = astToCoefficients(node.args[0]);
    const expNode = node.args[1].isParenthesisNode ? node.args[1].content : node.args[1];
    if (!expNode.isConstantNode) throw new Error('Esponente non costante non supportato.');
    const exp = Number(expNode.value);
    if (!Number.isInteger(exp) || exp < 0) throw new Error('Esponente non intero non supportato in un polinomio.');
    let result = [1];
    for (let i = 0; i < exp; i++) result = mulPoly(result, base);
    return result;
  }

  throw new Error('Espressione non riconosciuta come polinomio: ' + node.toString());
}

// separa un'espressione razionale (con o senza divisione) in coefficienti
// di numeratore e denominatore, usando math.rationalize per normalizzare
// ed espandere l'espressione prima dell'estrazione.
export function rationalToCoefficients(node) {
  const rationalized = math.rationalize(node, {}, true);
  const numerator = astToCoefficients(rationalized.numerator);
  const denominator = rationalized.denominator ? astToCoefficients(rationalized.denominator) : [1];
  return { numerator, denominator };
}

// formatta un array di coefficienti [a_n, ..., a_0] come stringa LaTeX leggibile.
export function formatPolyLatex(coeffsIn) {
  const coeffs = coeffsIn.slice();
  while (coeffs.length > 1 && Math.abs(coeffs[0]) < 1e-9) coeffs.shift();
  const n = coeffs.length - 1;
  const parts = [];

  coeffs.forEach((raw, i) => {
    const c = round(raw);
    if (Math.abs(c) < 1e-9) return;
    const power = n - i;
    const abs = Math.abs(c);
    let term;
    if (power === 0) term = `${abs}`;
    else if (power === 1) term = abs === 1 ? 'x' : `${abs}x`;
    else term = abs === 1 ? `x^{${power}}` : `${abs}x^{${power}}`;
    parts.push({ negative: c < 0, term });
  });

  if (!parts.length) return '0';

  return parts
    .map((p, i) => (i === 0 ? (p.negative ? '-' : '') + p.term : (p.negative ? ' - ' : ' + ') + p.term))
    .join('');
}

function round(x, decimals = 6) {
  const f = 10 ** decimals;
  return Math.round(x * f) / f;
}

export { round };

// per lo scope attuale, le funzioni irrazionali supportate sono esattamente
// del tipo sqrt(g(x)) a livello esterno (il caso classico del liceo).
// Ritorna il nodo del radicando g(x), o null se la forma non e' quella attesa.
export function extractSqrtRadicand(nodeIn) {
  const node = nodeIn.isParenthesisNode ? nodeIn.content : nodeIn;
  if (node.isFunctionNode && node.fn.name === 'sqrt' && node.args.length === 1) {
    return node.args[0];
  }
  return null;
}
