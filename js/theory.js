// theory.js — spiegazioni teoriche di ciascun passo, condivise tra la
// modalità guidata (esempi fissi) e la modalità con calcolo automatico.
// Il contenuto è tratto e adattato da percorso.md (Moduli 1, 2, 4, 5, 6),
// limitato per ora ai tipi di funzione supportati (razionali e irrazionali).

const COMMON = {
  symmetry: 'Prima si verifica che il dominio sia simmetrico rispetto all’origine (altrimenti la funzione non può essere né pari né dispari). Poi si calcola f(-x) e si confronta con f(x): se coincidono la funzione è pari (simmetrica rispetto all’asse y); se f(-x) = -f(x) è dispari (simmetrica rispetto all’origine); altrimenti non è né pari né dispari.',
  monotonicity: 'Criterio della derivata prima: dove f\'(x) > 0 la funzione è strettamente crescente, dove f\'(x) < 0 è strettamente decrescente. Nei punti critici (f\'(x) = 0): se il segno di f\' passa da + a -, è un massimo relativo; se passa da - a +, è un minimo relativo.',
  concavity: 'f\'\'(x) > 0 indica concavità verso l’alto (convessità: la curva sta sotto le tangenti); f\'\'(x) < 0 indica concavità verso il basso. Un punto è di flesso se f\'\' cambia segno in quel punto — condizione necessaria f\'\'(x₀) = 0, ma non sempre sufficiente.',
};

export const RATIONAL_THEORY = {
  domain: 'Il dominio è l’intersezione dei vincoli imposti da ogni componente della funzione: nessun vincolo per un polinomio (dominio ℝ); denominatore ≠ 0 per una frazione.',
  symmetry: COMMON.symmetry,
  sign: 'Il segno di un prodotto o quoziente cambia solo nei punti in cui uno dei fattori cambia segno: si scompone la funzione in fattori, si individuano gli zeri di ciascuno e si costruisce una tabella dei segni per dedurre il segno complessivo in ogni intervallo.',
  limits: 'Vicino a un punto escluso dal denominatore, il segno del limite si ottiene dalla regola del segno: segno(numeratore) × segno con cui il denominatore tende a zero. Per x → ±∞ conta il confronto tra i gradi di numeratore e denominatore (o, per un polinomio, solo il termine di grado massimo).',
  asymptotes: 'Asintoto verticale x = x₀ se almeno un limite laterale in un punto escluso dal dominio vale ±∞. Asintoto orizzontale y = L se il limite per x → ±∞ è finito. Se invece diverge ma la funzione cresce linearmente, si cerca l’asintoto obliquo y = mx + q, con m = lim f(x)/x e q = lim [f(x) - mx].',
  monotonicity: COMMON.monotonicity,
  concavity: COMMON.concavity,
};

export const IRRATIONAL_THEORY = {
  domain: 'Il dominio è l’intersezione dei vincoli: una radice di indice pari richiede che il radicando sia maggiore o uguale a zero (A(x) ≥ 0), ed eventuali denominatori devono essere diversi da zero.',
  symmetry: COMMON.symmetry,
  sign: 'Una radice quadrata è per definizione sempre ≥ 0 dove è definita: il segno di f(x) = √g(x) è quindi immediato, con f(x) = 0 esattamente dove si annulla il radicando.',
  limits: 'Se il dominio è un intervallo limitato, ai suoi estremi basta verificare la continuità (dove il radicando si annulla, la funzione vale 0 con continuità, senza asintoto). Se il dominio si estende a ±∞, il comportamento di f dipende da quello del radicando g(x).',
  asymptotes: 'Asintoto verticale dove il radicando, scritto come frazione, ha un denominatore che si annulla mentre il radicando tende a +∞. Se g(x) tende a un valore finito L ≥ 0, si ha l’asintoto orizzontale y = √L. Nel caso classico g(x) = ax² + bx + c con a > 0, √g(x) si comporta come una retta obliqua per x → ±∞.',
  monotonicity: COMMON.monotonicity,
  concavity: COMMON.concavity,
};
