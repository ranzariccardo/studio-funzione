// theory.js — spiegazioni teoriche di ciascun passo, condivise tra la
// modalità guidata (esempi fissi) e la modalità con calcolo automatico.
// Il contenuto è tratto e adattato da percorso.md (Moduli 1, 2, 3, 4, 5, 6),
// limitato per ora ai tipi di funzione supportati (razionali e irrazionali).

const COMMON = {
  symmetry: 'Perché conviene saperlo: se la funzione è pari o dispari, il grafico è simmetrico (rispetto all’asse y se pari, rispetto all’origine se dispari) — basta studiare metà dominio (x ≥ 0) e poi riflettere per ottenere l’altra metà, dimezzando il lavoro nei passi successivi (segno, derivate, grafico). In sintesi: si calcola f(-x) e si confronta con f(x). Se f(-x) = f(x) la funzione è pari; se f(-x) = -f(x) è dispari; altrimenti non è né pari né dispari.',
  limits: 'Prima di calcolare un limite, riconosci se è una forma indeterminata o no: dipende dal punto e dal tipo di funzione. Qui sotto trovi, punto per punto, quale forma è (se lo è) e il metodo migliore per risolverla.',
  monotonicity: 'Criterio della derivata prima: dove f\'(x) > 0 la funzione è strettamente crescente, dove f\'(x) < 0 è strettamente decrescente. Nei punti critici (f\'(x) = 0): se il segno di f\' passa da + a -, è un massimo relativo; se passa da - a +, è un minimo relativo.',
  concavity: 'f\'\'(x) > 0 indica concavità verso l’alto (convessità: la curva sta sotto le tangenti); f\'\'(x) < 0 indica concavità verso il basso. Un punto è di flesso se f\'\' cambia segno in quel punto — condizione necessaria f\'\'(x₀) = 0, ma non sempre sufficiente.',
};

export const RATIONAL_THEORY = {
  domain: 'Il dominio è l’intersezione dei vincoli imposti da ogni componente della funzione: nessun vincolo per un polinomio (dominio ℝ); denominatore ≠ 0 per una frazione.',
  symmetry: COMMON.symmetry,
  intersections: 'Asse y: si calcola f(0) — il punto è (0, f(0)), se x = 0 appartiene al dominio. Asse x: si pone f(x) = 0 e si risolve. Nelle funzioni fratte basta annullare il numeratore, ma la soluzione è valida solo se non annulla anche il denominatore.',
  sign: 'Si tratta di risolvere la disequazione f(x) > 0 (o ≥ 0): il segno di un prodotto o quoziente cambia solo nei punti in cui uno dei fattori cambia segno, quindi si scompone la funzione in fattori, si individuano gli zeri di ciascuno e si costruisce una tabella dei segni per dedurre il segno complessivo in ogni intervallo. Attenzione al vincolo tipico delle funzioni fratte: gli zeri del denominatore vanno sempre esclusi dalla tabella con un pallino vuoto (la funzione lì non è definita), anche quando non cambiano il segno del quoziente.',
  limits: COMMON.limits,
  asymptotes: 'Asintoto verticale x = x₀ se almeno un limite laterale in un punto escluso dal dominio vale ±∞. Asintoto orizzontale y = L se il limite per x → ±∞ è finito. Se invece diverge ma la funzione cresce linearmente, si cerca l’asintoto obliquo y = mx + q, con m = lim f(x)/x e q = lim [f(x) - mx].',
  monotonicity: COMMON.monotonicity,
  concavity: COMMON.concavity,
};

export const COMPOSITE_THEORY = {
  domain: 'Il dominio è l’intersezione dei vincoli imposti da OGNI componente della funzione, ovunque si trovi nell’espressione (anche annidata): denominatore ≠ 0 per ogni frazione; radicando ≥ 0 per ogni radice di indice pari; argomento > 0 per ogni logaritmo; per tangente/cotangente/secante/cosecante, la funzione trigonometrica al denominatore (coseno o seno, a seconda dei casi) deve essere ≠ 0; per arcoseno/arcocoseno, l’argomento deve stare tra -1 e 1. Esponenziale, seno, coseno e arcotangente non impongono invece alcun vincolo (dominio ℝ).',
};

export const IRRATIONAL_THEORY = {
  domain: 'Il dominio è l’intersezione dei vincoli: una radice di indice pari richiede che il radicando sia maggiore o uguale a zero (A(x) ≥ 0), ed eventuali denominatori devono essere diversi da zero.',
  symmetry: COMMON.symmetry,
  intersections: 'Asse y: si calcola f(0) — il punto è (0, f(0)), se x = 0 appartiene al dominio. Asse x: si pone f(x) = 0, cioè g(x) = 0 (il radicando si annulla). Qui non serve elevare al quadrato, quindi basta verificare che la soluzione trovata appartenga al dominio.',
  sign: 'Qui la disequazione f(x) ≥ 0 è già risolta in partenza: una radice quadrata è per definizione sempre ≥ 0 dove è definita, quindi il segno di f(x) = √g(x) coincide sempre con il dominio già trovato (positiva ovunque la funzione esiste, nulla esattamente dove si annulla il radicando). Non serve costruire una tabella dei segni separata.',
  limits: COMMON.limits,
  asymptotes: 'Asintoto verticale dove il radicando, scritto come frazione, ha un denominatore che si annulla mentre il radicando tende a +∞. Se g(x) tende a un valore finito L ≥ 0, si ha l’asintoto orizzontale y = √L. Nel caso classico g(x) = ax² + bx + c con a > 0, √g(x) si comporta come una retta obliqua per x → ±∞.',
  monotonicity: COMMON.monotonicity,
  concavity: COMMON.concavity,
};
