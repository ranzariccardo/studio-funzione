// examples/irrational.js — esempio fisso già risolto per la modalità guidata,
// per funzioni del tipo f(x) = √g(x).

import { IRRATIONAL_THEORY } from '../theory.js';

const sqrtExample = {
  exprStr: 'sqrt(4 - x^2)',
  exprLatex: '\\sqrt{4 - x^{2}}',
  steps: [
    {
      title: '1. Dominio',
      theory: IRRATIONAL_THEORY.domain,
      text: [
        '4 - x² ≥ 0 → x² ≤ 4 → -2 ≤ x ≤ 2.',
        'Dominio: [-2, 2].',
      ],
      formulas: [],
    },
    {
      title: '2. Simmetrie e intersezioni con gli assi',
      theory: IRRATIONAL_THEORY.symmetry,
      text: [
        'Il dominio [-2, 2] è simmetrico rispetto all’origine: il test si può applicare.',
        'g(x) = 4 - x² è pari (contiene solo potenze pari di x): f(x) è pari, simmetrica rispetto all’asse y.',
        'f(0) = √4 = 2 → intersezione con l’asse y: (0, 2).',
        '4 - x² = 0 → x = ±2 → intersezioni con l’asse x: (-2, 0), (2, 0).',
      ],
      formulas: [],
    },
    {
      title: '3. Segno della funzione',
      theory: IRRATIONAL_THEORY.sign,
      text: ['f(x) ≥ 0 su tutto il dominio; f(x) = 0 solo per x = ±2.'],
      formulas: [],
    },
    {
      title: '4. Limiti agli estremi del dominio',
      theory: IRRATIONAL_THEORY.limits,
      text: ['Il dominio [-2, 2] è limitato: non ci sono limiti a ±∞. Agli estremi x = -2 e x = 2 la funzione è continua e vale 0 (nessun asintoto verticale).'],
      formulas: [],
    },
    {
      title: '5. Asintoti',
      theory: IRRATIONAL_THEORY.asymptotes,
      text: ['Nessun asintoto: il dominio è limitato e la funzione è continua sui bordi.'],
      formulas: [],
    },
    {
      title: '6. Derivata prima: crescenza e decrescenza',
      theory: IRRATIONAL_THEORY.monotonicity,
      text: [
        'Si deriva usando la regola della catena: la derivata di √g(x) è g\'(x) / (2√g(x)).',
        'f\'(x) = -x / √(4 - x²).',
        'f\'(x) = 0 per x = 0.',
        'f\'(x) > 0 per -2 < x < 0: f crescente. f\'(x) < 0 per 0 < x < 2: f decrescente.',
        'x = 0 è un massimo relativo (e assoluto), f(0) = 2.',
      ],
      formulas: [],
    },
    {
      title: '7. Derivata seconda: concavità e flessi',
      theory: IRRATIONAL_THEORY.concavity,
      text: [
        'f\'\'(x) = -4 / (4 - x²)^{3/2}.',
        'f\'\'(x) < 0 su tutto il dominio aperto (-2, 2): la funzione è sempre concava verso il basso.',
        'Nessun punto di flesso (coerente con il grafico: una semicirconferenza).',
      ],
      formulas: [],
    },
  ],
};

export default {
  irrational: sqrtExample,
};
