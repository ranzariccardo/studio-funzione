// graph.js — wrapper su function-plot: disegna la funzione e accumula le
// annotazioni (dominio escluso, asintoti, punti) man mano che l'utente
// avanza tra i passi dello studio di funzione.

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

export function renderGraph(containerId) {
  const el = document.getElementById(containerId);
  if (!el || !currentFnExpr) return;
  el.innerHTML = '';

  const data = [{ fn: currentFnExpr, graphType: 'polyline', color: '#3b5bdb' }];
  const annotations = [];

  currentAnnotations.forEach((op) => {
    if (op.type === 'exclude' || op.type === 'asymptoteV') {
      annotations.push({ x: op.x, text: `x = ${round2(op.x)}` });
    } else if (op.type === 'asymptoteH') {
      annotations.push({ y: op.y, text: `y = ${round2(op.y)}` });
    } else if (op.type === 'asymptoteO') {
      data.push({ fn: `${op.m}*x + ${op.q}`, graphType: 'polyline', color: '#adb5bd', nSamples: 200 });
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
  } catch (e) {
    el.innerHTML = '<p class="hint">Non è stato possibile disegnare il grafico per questa funzione.</p>';
    console.error(e);
  }
}

function round2(x) {
  return Math.round(x * 100) / 100;
}
