// composite.js — riconoscimento e calcolo del dominio per funzioni composte
// (con esponenziali, logaritmi, funzioni goniometriche, combinate anche con
// frazioni e radici). Per ora calcola SOLO il passo del dominio: gli altri
// passi (simmetrie, segno, limiti, asintoti, derivate) sono roadmap futura,
// da affrontare quando arriveremo ai rispettivi punti di analisi.
//
// Metodo: si percorre l'albero sintattico dell'espressione (math.js) e si
// raccoglie un vincolo per ogni componente che ne impone uno (stesso
// principio della tabella "sei vincoli fondamentali" di percorso.md,
// Modulo 1). Ogni vincolo si riduce a una delle tre forme primitive
// E(x) ≥ 0, E(x) > 0 o E(x) ≠ 0 per una sotto-espressione E; si risolve
// numericamente (stessa tecnica generica già usata per razionali e
// irrazionali: ricerca zeri + campionamento del segno, che non richiede
// struttura polinomiale). Il dominio finale è l'intersezione di tutti i
// vincoli.

import { compile, round } from './parser.js';
import { numericRealRoots, signIntervals, intersectIntervals, complementIntervals } from './roots.js';
import { COMPOSITE_THEORY } from '../theory.js';

const RANGE = { from: -30, to: 30 };
const VIEW_DOMAIN = { from: -10, to: 10 };
// per le bande del grafico: un estremo "infinito" (== bordo di RANGE) viene
// esteso fino a qui invece che tagliato alla vista iniziale, così la banda
// resta piena anche zoomando indietro.
const GRAPH_INFINITY = 1e4;

function fmtNum(x) {
  return `${round(x, 4)}`;
}

function toGraphExtent(iv) {
  return {
    from: iv.from === RANGE.from ? -GRAPH_INFINITY : iv.from,
    to: iv.to === RANGE.to ? GRAPH_INFINITY : iv.to,
  };
}

function buildFn(name, argNode) {
  return new math.FunctionNode(new math.SymbolNode(name), [argNode]);
}

function buildAddConst(node, c) {
  return new math.OperatorNode('+', 'add', [node, new math.ConstantNode(c)]);
}

function buildConstSub(c, node) {
  return new math.OperatorNode('-', 'subtract', [new math.ConstantNode(c), node]);
}

// percorre l'albero e restituisce un vincolo per ogni componente che lo
// impone. Ogni vincolo: { expr: nodo da valutare, pred: 'ge'|'gt'|'ne', describe }.
export function collectDomainConstraints(root) {
  const constraints = [];

  root.traverse((n) => {
    if (n.isFunctionNode) {
      const name = n.fn.name;
      const arg = n.args[0];

      if (name === 'sqrt' && n.args.length === 1) {
        constraints.push({ expr: arg, pred: 'ge', describe: 'una radice quadrata (il radicando deve essere ≥ 0)' });
      } else if ((name === 'log' || name === 'log10' || name === 'log2') && n.args.length >= 1) {
        constraints.push({ expr: arg, pred: 'gt', describe: 'un logaritmo (l’argomento deve essere > 0)' });
      } else if (name === 'tan') {
        constraints.push({ expr: buildFn('cos', arg), pred: 'ne', describe: 'una tangente (il coseno dell’argomento deve essere ≠ 0)' });
      } else if (name === 'cot') {
        constraints.push({ expr: buildFn('sin', arg), pred: 'ne', describe: 'una cotangente (il seno dell’argomento deve essere ≠ 0)' });
      } else if (name === 'sec') {
        constraints.push({ expr: buildFn('cos', arg), pred: 'ne', describe: 'una secante (il coseno dell’argomento deve essere ≠ 0)' });
      } else if (name === 'csc') {
        constraints.push({ expr: buildFn('sin', arg), pred: 'ne', describe: 'una cosecante (il seno dell’argomento deve essere ≠ 0)' });
      } else if (name === 'asin' || name === 'acos') {
        const label = name === 'asin' ? 'un arcoseno' : 'un arcocoseno';
        constraints.push({ expr: buildAddConst(arg, 1), pred: 'ge', describe: `${label} (l’argomento deve essere compreso tra -1 e 1)` });
        constraints.push({ expr: buildConstSub(1, arg), pred: 'ge', describe: `${label} (l’argomento deve essere compreso tra -1 e 1)` });
      }
    }
    if (n.isOperatorNode && n.fn === 'divide') {
      constraints.push({ expr: n.args[1], pred: 'ne', describe: 'una frazione (il denominatore deve essere ≠ 0)' });
    }
  });

  return constraints;
}

export function computeSteps({ node }) {
  const constraints = collectDomainConstraints(node);
  return [domainStep({ node, constraints })];
}

function domainStep({ constraints }) {
  const describeList = [...new Set(constraints.map((c) => c.describe))];

  const prompt = describeList.length
    ? [
        'Osserva la funzione prima di calcolare: contiene ' + describeList.join('; ') + '.',
        'Prova a stabilire da solo il dominio, mettendo a sistema tutti questi vincoli (l’intersezione di tutte le condizioni).',
      ]
    : [
        'Osserva la funzione prima di calcolare: non contiene frazioni, radici, logaritmi o altre componenti che impongano vincoli (esponenziali, seno, coseno e arcotangente non ne impongono).',
        'Prova a dedurre da solo il dominio.',
      ];

  const acceptedSets = [];
  const excludedPoints = []; // punti isolati (es. denominatore) — mai sui bordi di un intervallo
  const strictBoundaryRoots = []; // bordi di vincoli stretti (>), es. argomento del logaritmo

  constraints.forEach((c) => {
    const fn = compile(c.expr);
    const roots = numericRealRoots(fn, RANGE);

    if (c.pred === 'ne') {
      excludedPoints.push(...roots);
      return;
    }

    const intervals = signIntervals(fn, roots, RANGE);
    const keep = intervals.filter((iv) => iv.sign > 0).map((iv) => ({ from: iv.from, to: iv.to }));
    acceptedSets.push(keep);
    if (c.pred === 'gt') strictBoundaryRoots.push(...roots);
  });

  const acceptedIntervals = intersectIntervals(acceptedSets, RANGE);
  const isStrictBoundary = (v) => strictBoundaryRoots.some((r) => Math.abs(r - v) < 1e-4);

  const dedupedExcluded = [...new Set(excludedPoints.map((x) => round(x, 6)))]
    .sort((a, b) => a - b)
    .filter((x) => acceptedIntervals.some((iv) => iv.from - 1e-6 <= x && x <= iv.to + 1e-6));
  // per componenti periodiche (es. tangente) i punti esclusi possono essere
  // molti: nel testo ne mostriamo solo un assaggio nella finestra del grafico,
  // il resto si intuisce dalla periodicità.
  const excludedInView = dedupedExcluded.filter((x) => x >= VIEW_DOMAIN.from && x <= VIEW_DOMAIN.to);
  const hasMoreExcluded = excludedInView.length < dedupedExcluded.length;

  const parts = acceptedIntervals.map((iv) => {
    const fromInf = iv.from === RANGE.from;
    const toInf = iv.to === RANGE.to;
    const openFrom = fromInf || isStrictBoundary(iv.from);
    const openTo = toInf || isStrictBoundary(iv.to);
    const fromLabel = fromInf ? '-∞' : fmtNum(iv.from);
    const toLabel = toInf ? '+∞' : fmtNum(iv.to);
    return `${openFrom ? '(' : '['}${fromLabel}, ${toLabel}${openTo ? ')' : ']'}`;
  });

  const isWholeRange = acceptedIntervals.length === 1
    && acceptedIntervals[0].from === RANGE.from && acceptedIntervals[0].to === RANGE.to;

  const answer = [];
  if (!parts.length) {
    answer.push('Il dominio risulta vuoto per questa funzione.');
  } else if (isWholeRange && !excludedInView.length && !hasMoreExcluded) {
    answer.push('Nessun vincolo si applica (o si semplifica): il dominio è tutto ℝ.');
  } else if (excludedInView.length) {
    const suffix = hasMoreExcluded ? ' (e altri, che si ripetono con lo stesso schema al di fuori di questo intervallo)' : '';
    answer.push(`Dominio: ${isWholeRange ? 'ℝ' : parts.join(' ∪ ')}, esclusi i punti x = ${excludedInView.map(fmtNum).join(', ')}${suffix}.`);
  } else if (hasMoreExcluded) {
    answer.push(`Dominio: ${isWholeRange ? 'ℝ' : parts.join(' ∪ ')}, con dei punti esclusi al di fuori dell’intervallo mostrato nel grafico.`);
  } else {
    answer.push(`Dominio: ${parts.join(' ∪ ')}.`);
  }
  answer.push('Gli altri passi (simmetrie, segno, limiti, asintoti, derivate) per le funzioni composte sono roadmap futura: arriveranno via via che li affrontiamo.');

  const rejectedIntervals = complementIntervals(acceptedIntervals, RANGE);
  const graphOps = [
    ...acceptedIntervals.map((iv) => ({ type: 'domainBand', ...toGraphExtent(iv) })),
    ...rejectedIntervals.map((iv) => ({ type: 'domainBandExcluded', ...toGraphExtent(iv) })),
    ...excludedInView.map((x) => ({ type: 'exclude', x })),
  ];

  return {
    key: 'domain',
    title: '1. Dominio',
    theory: COMPOSITE_THEORY.domain,
    prompt,
    answer,
    formulas: [],
    graphOps,
  };
}
