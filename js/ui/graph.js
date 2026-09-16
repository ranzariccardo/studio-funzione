// graph.js — wrapper su function-plot: disegna la funzione e accumula le
// annotazioni (dominio escluso, asintoti, punti) man mano che l'utente
// avanza tra i passi dello studio di funzione.

// altezza usata per le bande rosse/verdi: molto più grande di qualunque
// zoom ragionevole, così restano piene anche zoomando indietro (function-plot
// ridisegna i dati in base al nuovo dominio visibile, ma un confine fisso
// come currentDomain[1] resterebbe ancorato alla vista iniziale).
const HUGE = 1e4;
const ASYMPTOTE_COLOR = '#1c7ed6';

let currentAnnotations = [];
let currentFnExpr = null;
let currentDomain = [-10, 10];

export function resetGraph(fnExpr, domain = [-10, 10]) {
  currentAnnotations = [];
  currentFnExpr = fnExpr;
  currentDomain = domain;
}

export function addGraphOps(ops) {
  currentAnnotations.push(...(ops || []));
}

export function renderGraph(containerId, options = {}) {
  const el = document.getElementById(containerId);
  if (!el || !currentFnExpr) return;
  el.innerHTML = '';

  const showCurve = options.showCurve !== false;
  const data = showCurve ? [{ fn: currentFnExpr, graphType: 'polyline', color: '#3b5bdb' }] : [];
  const annotations = [];
  const trends = { tl: false, tr: false, bl: false, br: false };

  currentAnnotations.forEach((op) => {
    if (op.type === 'exclude') {
      annotations.push({ x: op.x, text: `x = ${round2(op.x)}` });
    } else if (op.type === 'asymptoteV') {
      annotations.push({ x: op.x, text: `x = ${round2(op.x)}`, attr: { stroke: ASYMPTOTE_COLOR, 'stroke-width': 1.5 } });
    } else if (op.type === 'asymptoteH') {
      annotations.push({ y: op.y, text: `y = ${round2(op.y)}`, attr: { stroke: ASYMPTOTE_COLOR, 'stroke-width': 1.5 } });
    } else if (op.type === 'asymptoteO') {
      data.push({ fn: `${op.m}*x + ${op.q}`, graphType: 'polyline', color: ASYMPTOTE_COLOR, nSamples: 200 });
    } else if (op.type === 'domainBand') {
      data.push({ fn: '0', range: [op.from, op.to], graphType: 'polyline', color: '#2f9e44', nSamples: 2, skipTip: true });
    } else if (op.type === 'domainBandExcluded') {
      pushForbiddenBand(data, op.from, op.to, HUGE);
      pushForbiddenBand(data, op.from, op.to, -HUGE);
    } else if (op.type === 'signForbidden') {
      pushForbiddenBand(data, op.from, op.to, op.side === 'above' ? HUGE : -HUGE);
    } else if (op.type === 'point') {
      data.push({
        points: [[op.x, op.y]],
        fnType: 'points',
        graphType: 'scatter',
        color: '#495057',
      });
    } else if (op.type === 'extremum') {
      data.push({
        points: [[op.x, op.y]],
        fnType: 'points',
        graphType: 'scatter',
        color: op.kind === 'max' ? '#e8590c' : '#2f9e44',
      });
    } else if (op.type === 'trendEdge') {
      const key = (op.direction === 'up' ? 't' : 'b') + (op.side === 'left' ? 'l' : 'r');
      trends[key] = true;
    }
  });

  const width = Math.max(280, Math.min(el.clientWidth || 700, 700));

  try {
    functionPlot({
      target: `#${containerId}`,
      width,
      height: 340,
      grid: true,
      xAxis: { domain: currentDomain },
      yAxis: { domain: currentDomain },
      annotations,
      data,
    });
    updateTrendBadges(el, trends);
  } catch (e) {
    el.innerHTML = '<p class="hint">Non è stato possibile disegnare il grafico per questa funzione.</p>';
    updateTrendBadges(el, { tl: false, tr: false, bl: false, br: false });
    console.error(e);
  }
}

// mostra/nasconde le frecce "tende a ±∞" agli angoli del riquadro: sono
// elementi DOM ancorati via CSS a #graph-wrap, non ai dati di function-plot,
// così restano al bordo del grafico visibile a qualunque zoom/pan.
function updateTrendBadges(graphEl, trends) {
  const wrap = graphEl.parentElement;
  if (!wrap) return;
  ['tl', 'tr', 'bl', 'br'].forEach((pos) => {
    const badge = wrap.querySelector(`.graph-trend-${pos}`);
    if (badge) badge.hidden = !trends[pos];
  });
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

// riempie di rosso l'area tra y = 0 e y = boundary sull'intervallo [from, to],
// sfruttando il flag "closed" di function-plot (fill automatico verso l'asse x).
function pushForbiddenBand(data, from, to, boundary) {
  data.push({
    fn: `${boundary}`,
    range: [from, to],
    graphType: 'polyline',
    color: '#e03131',
    closed: true,
    nSamples: 2,
    skipTip: true,
    attr: { 'fill-opacity': 0.12 },
  });
}
