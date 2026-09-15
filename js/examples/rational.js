// examples/rational.js — esempi fissi già risolti per la modalità guidata
// (nessun calcolo a runtime: teoria del passo + esempio applicato a mano).

import { RATIONAL_THEORY } from '../theory.js';

const polyExample = {
  exprStr: 'x^3 - 3x',
  exprLatex: 'x^{3} - 3x',
  steps: [
    {
      title: '1. Dominio',
      theory: RATIONAL_THEORY.domain,
      text: ['Esempio: f(x) = x³ - 3x è un polinomio: non ci sono vincoli da imporre, quindi il dominio è tutto ℝ.'],
      formulas: [],
    },
    {
      title: '2. Simmetrie e intersezioni con gli assi',
      theory: RATIONAL_THEORY.symmetry,
      text: [
        'Il dominio (ℝ) è simmetrico rispetto all’origine: il test si può applicare.',
        'f(-x) = -x³ + 3x = -(x³ - 3x) = -f(x): la funzione è dispari.',
        'Intersezione con l’asse y: (0, 0).',
        'Intersezioni con l’asse x: x³ - 3x = 0 → x(x² - 3) = 0 → x = 0, x = √3, x = -√3.',
      ],
      formulas: [],
    },
    {
      title: '3. Segno della funzione',
      theory: RATIONAL_THEORY.sign,
      text: [
        'f(x) = x(x - √3)(x + √3).',
        'f(x) > 0 per -√3 < x < 0 oppure x > √3.',
        'f(x) < 0 per x < -√3 oppure 0 < x < √3.',
      ],
      formulas: [],
    },
    {
      title: '4. Limiti agli estremi del dominio',
      theory: RATIONAL_THEORY.limits,
      text: [
        'Per un polinomio, agli estremi del dominio (±∞) conta solo il termine di grado massimo e il suo segno.',
        'lim x→-∞ f(x) = -∞ (grado dispari, coefficiente direttivo positivo).',
        'lim x→+∞ f(x) = +∞.',
      ],
      formulas: [],
    },
    {
      title: '5. Asintoti',
      theory: RATIONAL_THEORY.asymptotes,
      text: ['Un polinomio di grado maggiore di 1 non ha mai asintoti: nessun asintoto per questa funzione.'],
      formulas: [],
    },
    {
      title: '6. Derivata prima: crescenza e decrescenza',
      theory: RATIONAL_THEORY.monotonicity,
      text: [
        'f\'(x) = 3x² - 3 = 3(x - 1)(x + 1).',
        'f\'(x) = 0 per x = -1 e x = 1.',
        'f\'(x) > 0 per x < -1 o x > 1: f crescente.',
        'f\'(x) < 0 per -1 < x < 1: f decrescente.',
        'x = -1 è un massimo relativo, f(-1) = 2. x = 1 è un minimo relativo, f(1) = -2.',
      ],
      formulas: [],
    },
    {
      title: '7. Derivata seconda: concavità e flessi',
      theory: RATIONAL_THEORY.concavity,
      text: [
        'f\'\'(x) = 6x.',
        'f\'\'(x) < 0 per x < 0: concavità verso il basso.',
        'f\'\'(x) > 0 per x > 0: concavità verso l’alto.',
        'x = 0 è un punto di flesso, f(0) = 0.',
      ],
      formulas: [],
    },
  ],
};

const fractionExample = {
  exprStr: '(x^2 - 1) / (x - 2)',
  exprLatex: '\\frac{x^{2}-1}{x-2}',
  steps: [
    {
      title: '1. Dominio',
      theory: RATIONAL_THEORY.domain,
      text: ['Il denominatore x - 2 si annulla per x = 2. Dominio: ℝ \\ {2}.'],
      formulas: [],
    },
    {
      title: '2. Simmetrie e intersezioni con gli assi',
      theory: RATIONAL_THEORY.symmetry,
      text: [
        'f(-x) non coincide né con f(x) né con -f(x): la funzione non è né pari né dispari.',
        'f(0) = (0 - 1)/(0 - 2) = 0.5 → intersezione con l’asse y: (0, 0.5).',
        'Numeratore x² - 1 = 0 → x = 1, x = -1 (nessuno dei due annulla il denominatore) → intersezioni con l’asse x: (1, 0), (-1, 0).',
      ],
      formulas: [],
    },
    {
      title: '3. Segno della funzione',
      theory: RATIONAL_THEORY.sign,
      text: [
        'N(x) = (x-1)(x+1) > 0 per x < -1 o x > 1. D(x) = x - 2 > 0 per x > 2.',
        'f(x) > 0 per -1 < x < 1 oppure x > 2.',
        'f(x) < 0 per x < -1 oppure 1 < x < 2.',
      ],
      formulas: [],
    },
    {
      title: '4. Limiti agli estremi del dominio',
      theory: RATIONAL_THEORY.limits,
      text: [
        'Per x → 2⁻: f(x) → -∞. Per x → 2⁺: f(x) → +∞.',
        'Il grado del numeratore (2) supera di 1 quello del denominatore (1): dividendo si ottiene f(x) = x + 2 + 3/(x-2), quindi per x → ±∞, f(x) si comporta come x + 2.',
      ],
      formulas: [],
    },
    {
      title: '5. Asintoti',
      theory: RATIONAL_THEORY.asymptotes,
      text: [
        'Asintoto verticale: x = 2.',
        'Asintoto obliquo: y = x + 2 (grado numeratore = grado denominatore + 1).',
      ],
      formulas: [],
    },
    {
      title: '6. Derivata prima: crescenza e decrescenza',
      theory: RATIONAL_THEORY.monotonicity,
      text: [
        'f\'(x) = (x² - 4x + 1) / (x - 2)².',
        'x² - 4x + 1 = 0 → x = 2 ± √3 (≈ 0.27 e ≈ 3.73).',
        'f crescente per x < 2-√3; decrescente per 2-√3 < x < 2 e per 2 < x < 2+√3; crescente per x > 2+√3.',
        'x = 2-√3 è un massimo relativo (f ≈ 0.54). x = 2+√3 è un minimo relativo (f ≈ 7.46).',
      ],
      formulas: [],
    },
    {
      title: '7. Derivata seconda: concavità e flessi',
      theory: RATIONAL_THEORY.concavity,
      text: [
        'f\'\'(x) = 6 / (x - 2)³.',
        'f\'\'(x) < 0 per x < 2: concava verso il basso. f\'\'(x) > 0 per x > 2: concava verso l’alto.',
        'Nessun flesso, perché x = 2 non appartiene al dominio.',
      ],
      formulas: [],
    },
  ],
};

export default {
  'rational-poly': polyExample,
  'rational-fraction': fractionExample,
};
