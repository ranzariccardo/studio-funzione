# Sito "Studio di Funzione" passo-passo

Sito web statico, responsive, gratuito (hosting GitHub Pages, sottodominio
`.github.io`, nessun dominio personalizzato), che guida uno studente di
liceo attraverso lo studio di funzione passo-passo — con la propria
funzione (calcolo automatico) o senza (teoria + esempio guidato fisso).

**Online:** https://ranzariccardo.github.io/studio-funzione/
**Repo:** https://github.com/ranzariccardo/studio-funzione

Piano approvato di riferimento: `C:\Users\richi\.claude\plans\purring-swinging-pixel.md`.
Documento di teoria più ampio (11 moduli, roadmap futura, non ancora
integrato oltre ai Moduli 1,2,4,5,6): `percorso.md` nella root del progetto.

**Stack:** vanilla JS (ES modules), nessun build step, librerie via CDN:
math.js (parsing/derivate), KaTeX (formule), function-plot + d3 (grafico),
MathLive (`<math-field>`, input matematico visuale stile Photomath con
tastiera simboli integrata — l'output `getValue('ascii-math')` **non** è
sempre compatibile con `math.parse()` così com'è: MathLive esporta
`arcsin`/`arccos`/`arctan`/`ln`, che math.js non riconosce (vuole
`asin`/`acos`/`atan`/`log`) — `parser.js` li rinomina nell'albero subito
dopo il parsing (`FUNCTION_ALIASES`). Nota anche: il logaritmo in base 10
inserito con il template con pedice della tastiera MathLive (`log₁₀(x)`)
NON viene interpretato correttamente da math.js (diventa una
moltiplicazione implicita insensata) — un utente dovrebbe scrivere
`log10(x)` come testo semplice; non ancora risolto).

**Scope attuale:** funzioni razionali (polinomiali e fratte) e irrazionali
nella forma √g(x) — analisi completa (8 passi). Funzioni composte
(esponenziali, logaritmiche, goniometriche, radici e frazioni annidate,
in qualunque combinazione) — **solo il passo Dominio** per ora, calcolato
in modo generale (vedi sotto); gli altri passi (simmetrie, segno, limiti,
asintoti, derivate) per le composte sono roadmap futura, da affrontare
uno alla volta su richiesta esplicita dell'utente — non anticiparli.
Teoremi con dimostrazioni e integrali (presenti in `percorso.md`) restano
fuori scope.

---

## STRUTTURA FILE

```
sito_mate/
  .gitignore              # .DS_Store, Thumbs.db
  index.html              # home: campo funzione (math-field) + selettore tipo + avvio
  css/
    style.css              # responsive, mobile-first
  js/
    app.js                 # stato dell'app, routing tra gli step, wiring UI
    theory.js               # teoria condivisa (da percorso.md) tra modalità guidata e calcolata
    engine/
      parser.js             # parsing (math.js), riconoscimento tipo, estrazione coefficienti polinomiali
      roots.js               # ricerca radici (algebrica gradi bassi + numerica), intervalli di segno
      rational.js            # 8 passi {theory,prompt,answer,formulas,graphOps} per funzioni razionali (poly/fratte)
      irrational.js          # 8 passi {theory,prompt,answer,formulas,graphOps} per funzioni √g(x)
      composite.js            # SOLO passo Dominio, generale, per funzioni composte (log/goniometriche/esponenziali)
    ui/
      steps.js               # render passo: prompt sempre visibile, risposta dietro bottone "Mostra risposta" + stepper
      graph.js                # wrapper function-plot, annotazioni cumulative per passo
    examples/
      rational.js             # esempi fissi già risolti (poly + fratta) per modalità guidata
      irrational.js           # esempio fisso già risolto (√(4-x²)) per modalità guidata
  percorso.md              # curriculum teorico completo a 11 moduli (roadmap futura)
  README.md
```

## STATO PROGETTO

### Completato
- Shell HTML/CSS responsive (mobile-first) con doppio percorso: con funzione
  inserita (calcolo automatico) o senza (teoria + esempio guidato)
- Input funzione visuale stile Photomath via MathLive (`<math-field>`,
  tastiera simboli integrata, `ascii-math` → `math.parse()` diretto)
- Motore di calcolo completo (8 passi: dominio, simmetrie, intersezioni
  con gli assi, segno, limiti, asintoti, derivata prima/monotonia/estremi,
  derivata seconda/concavità/flessi) per funzioni razionali (poly e
  fratte) e per irrazionali nella forma √g(x) — vedi più sotto il modello
  "prompt → rivela risposta" per come ogni passo viene presentato
- Grafico (function-plot) che si aggiorna cumulativamente passo dopo passo
  (solo per i passi rivelati) con le annotazioni del passo corrente
  (esclusioni dominio, asintoti,
  punti, estremi)
- Modalità guidata con esempio fisso per ciascuno dei 3 tipi supportati
- Teoria di ogni passo arricchita con le regole di `percorso.md` (Moduli
  1, 2, 4, 5, 6), condivisa tra modalità guidata e modalità calcolata
- Verificato nel browser (non solo letto): trovati e corretti 2 bug reali
  — classificazione massimo/minimo errata dal secondo punto critico in poi
  (bug in `rational.js`/`irrational.js`, `.find()` con condizione debole);
  `sqrt` interpretato erroneamente come variabile sconosciuta invece che
  nome di funzione (bug in `parser.js`, mancava il controllo sul parent
  `FunctionNode`)
- Verificata vista mobile (375×812) in entrambe le modalità (guidata e
  calcolata): nessun overflow orizzontale, MathLive e formule KaTeX (anche
  f''(x) con frazioni annidate) si adattano correttamente, breakpoint
  `max-width:480px` attivo. Trovato 1 problema minore (vedi Da fare)
- Restyle UI in stile shadcn/ui (decisione esplicita: solo CSS, architettura
  vanilla JS/no-build invariata — niente React/Tailwind). Token (palette
  zinc, radius 8px, ombre, altezze bottoni/input) verificati dai sorgenti
  del pacchetto Flutter `shadcn_ui` in `C:\Users\richi\Downloads\shadcn_ui-0.56.1`
  (font Google Sans Flex via Google Fonts)
- Ristrutturato lo step 1 (`index.html`/`css/style.css`): il campo funzione
  è ora il percorso primario (il tipo si riconosce sempre in automatico dal
  parser); il dropdown "tipo di funzione" è stato rietichettato come
  "esempio guidato" perché nel codice (`app.js`) viene letto solo quando il
  campo funzione è vuoto — prima il testo lasciava intendere (erroneamente)
  che servisse da conferma del tipo anche con una funzione inserita
- Repository git inizializzato, primo commit fatto, repo GitHub creato e
  collegato come remote: https://github.com/ranzariccardo/studio-funzione
  (pubblico, necessario per GitHub Pages gratuito), push di `master` fatto
- GitHub Pages attivato (branch `master`, root) e verificato online (200
  OK): **https://ranzariccardo.github.io/studio-funzione/**
- **Modalità calcolata: modello "prompt → rivela risposta" per ogni passo**
  (architettura attuale, sostituisce un tentativo intermedio con passi
  Dominio separati in due voci stepper — scartato). Ogni passo (8 totali:
  Dominio, Simmetrie, Intersezioni con gli assi, Segno, Limiti, Asintoti,
  Derivata prima, Derivata seconda) mostra sempre teoria + "prompt" (invito
  a provare a calcolare da solo, senza numeri); un bottone "Mostra
  risposta" dentro allo stesso passo rivela poi la risposta (in un
  riquadro `.answer-box`) e le formule. Il grafico (`#graph-wrap`) resta
  **completamente nascosto** finché nessun passo è stato rivelato; una
  volta rivelato almeno un passo, mostra solo le graphOps dei passi
  **rivelati** (non di tutti i passi fino a quello corrente) — mai la
  curva di f(x), tranne all'ultimo passo (Derivata seconda, flag
  `revealsCurve: true`), e solo dopo averlo rivelato.
  Simmetrie e Intersezioni con gli assi sono due passi separati (prima
  erano uniti); teoria di Simmetrie ora spiega anche il perché è utile
  saperlo (dimezza il lavoro se la funzione è pari/dispari).
  Stato tracciato in `state.revealed` (array di booleani per indice,
  persiste navigando avanti/indietro tra i passi).
  File: `js/engine/{rational,irrational}.js` (ogni step ritorna
  `{theory, prompt, answer, formulas, graphOps, revealsCurve?}`),
  `js/engine/roots.js` (helper `clipIntervals`/`complementIntervals`),
  `js/ui/steps.js` (`renderStep` gestisce sia il nuovo formato
  prompt/answer sia il formato legacy `{text}` della modalità guidata,
  non toccata), `js/ui/graph.js` (graphOps `domainBand` verde/
  `domainBandExcluded` rosso, opzione `showCurve`), `js/app.js`
  (`state.revealed`, mostra/nasconde `#graph-wrap` in base a se qualcosa
  è stato rivelato).
  Non toccati gli esempi fissi della modalità guidata
  (`js/examples/*.js`, formato legacy `{title, theory, text, formulas}`
  senza bottone reveal) — l'utente valuta di rimuovere del tutto il
  dropdown "esempio guidato" più avanti, quindi non investirci lavoro
  senza conferma esplicita.
  Verificato nel browser: razionale fratta e irrazionale √(4-x²) — reveal
  per passo, stato mantenuto tornando indietro, grafico nascosto finché
  nulla è rivelato, curva visibile solo all'ultimo passo dopo reveal,
  nessun errore console.
- **Riconoscimento e dominio per funzioni composte** (log, goniometriche,
  esponenziali, radici/frazioni annidate, in qualunque combinazione — su
  richiesta esplicita, "pensiamoci passo passo": per ora solo il passo
  Dominio, il resto quando arriveremo ai rispettivi punti di analisi).
  Metodo generale (`js/engine/composite.js`): si percorre l'intero albero
  sintattico (`node.traverse`) e si raccoglie un vincolo per ogni
  componente — denominatore ≠0, radicando ≥0, argomento log >0, coseno/
  seno ≠0 per tangente/cotangente/secante/cosecante, argomento tra -1 e 1
  per arcoseno/arcocoseno — riducendo ognuno a una delle tre forme
  primitive E(x)≥0 / E(x)>0 / E(x)≠0, risolte numericamente (stessa
  tecnica generica già usata per razionali/irrazionali: `numericRealRoots`
  + `signIntervals`, che non richiede struttura polinomiale) e intersecate
  (`roots.js`, nuovo helper `intersectIntervals`). Vincoli stretti (`>`)
  producono bordi di intervallo aperti nella notazione, non solo punti
  esclusi separati (bug trovato e corretto: `ln(x)` dava inizialmente
  "[0,+∞) esclusi i punti x=0", contraddittorio — ora "(0, +∞)").
  `parser.js`: rimosso il blocco che rifiutava le funzioni trascendenti
  (`TRANSCENDENTAL_FUNCTIONS`, ex `UNSUPPORTED_FUNCTIONS`), nuovo tipo
  `'composite'` quando una qualunque è presente (ha priorità su
  razionale/irrazionale, che restano invariati se non ci sono funzioni
  trascendenti); aggiunta `FUNCTION_ALIASES` per rinominare
  arcsin/arccos/arctan/ln (nomi MathLive) in asin/acos/atan/log (nomi
  math.js) nell'albero appena parsato — bug reale trovato testando con la
  tastiera matematica vera, non solo con stringhe scritte a mano.
  `app.js`: `ENGINES` map per instradare `irrational`/`composite` al
  motore giusto, banner di riconoscimento avvisa che per le composte si
  calcola solo il dominio.
  Verificato nel browser con MathLive vero (non solo stringhe): esempio
  completo di `percorso.md` √(x²-4)·log(x)/(x-3) → `[2, +∞) esclusi i
  punti x=3` (equivalente a [2,3)∪(3,+∞)); `tan(x)` → esclusioni
  periodiche troncate alla finestra del grafico con nota "e altri...";
  `arcsin(x)` → `[-1,1]`; `ln(x)` (via `\ln` LaTeX) → `(0,+∞)`;
  `sin(x)+exp(x)` → "dominio è tutto ℝ"; nessuna regressione su
  razionali/irrazionali esistenti; nessun errore console.
  **Limite noto non risolto:** `log₁₀(x)` inserito con il template a
  pedice della tastiera MathLive produce ascii-math che math.js interpreta
  come moltiplicazione implicita insensata, non come log in base 10 (va
  scritto `log10(x)` come testo semplice).
- **Teoria di Simmetrie, Intersezioni, Segno e Limiti semplificata e resa
  specifica per tipo** (razionali/irrazionali), su richiesta esplicita
  dell'utente di spiegazioni "più semplici, sintetiche e dirette".
  Simmetrie: tolto il passaggio sul dominio simmetrico, resta solo "calcola
  f(-x) e confronta con f(x)". Intersezioni: asse y sempre, asse x con il
  vincolo tipico del tipo (fratte: non annullare anche il denominatore;
  irrazionali: equivale a g(x)=0, nessuna soluzione estranea). Segno:
  richiamo esplicito alla disequazione, vincolo tipico per tipo (fratte:
  escludere gli zeri del denominatore dalla tabella; irrazionali: il segno
  coincide col dominio, nessuna tabella necessaria). **Limiti** (ultima
  iterazione, la più sostanziale): la teoria statica in `theory.js` è stata
  ridotta a una riga generica che rimanda al `prompt`, che ora è generato
  **dinamicamente per punto** in `js/engine/{rational,irrational}.js`
  (`limitsStep`) in base alla funzione specifica riconosciuta — per ogni
  punto in cui va calcolato un limite dice se è una forma indeterminata o
  no e il metodo migliore (razionali: regola del segno ai punti esclusi se
  non indeterminato, altrimenti forma 0/0 → scomposizione; forma ∞/∞ per
  x→±∞ se è una frazione → dividi per il grado più alto, altrimenti nessuna
  forma indeterminata; irrazionali: stessa logica applicata al radicando
  g(x), più il suggerimento di raccogliere x² sotto radice per g di secondo
  grado). Un tentativo intermedio (teoria statica con tutti i casi
  possibili elencati in prosa, compresi limiti notevoli/equivalenti
  asintotici/gerarchia degli infiniti da `percorso.md` Modulo 3) è stato
  scartato dopo feedback esplicito ("troppe info") — quei tre strumenti non
  sono comunque rilevanti per funzioni senza esponenziali/log/goniometriche
  (fuori scope attuale).
- **Zone rosse "escluse dal piano" nel grafico** (dominio e segno), al
  posto della semplice linea piatta usata prima. Tecnica: sfrutta il flag
  `closed: true` di function-plot (fill automatico verso l'asse x — stessa
  libreria, nessuna manipolazione di internals), estratta in un helper
  `pushForbiddenBand` in `js/ui/graph.js`. Passo Segno: rosso sopra l'asse
  dove f(x)<0, sotto dove f(x)>0 (razionali); sotto l'asse su tutto il
  dominio per le irrazionali (dato che √g(x) è sempre ≥0 dove esiste).
  Passo Dominio: la banda escludeva prima solo con una riga, ora è un'area
  piena su tutta l'altezza.
- **Fix bande che non seguivano lo zoom del grafico**: le bande di
  dominio/segno erano ancorate ai limiti della vista iniziale (-10/10)
  invece di estendersi davvero all'infinito dove l'intervallo è aperto —
  zoomando indietro restavano "intrappolate" in un quadrato. Corretto in
  `js/ui/graph.js` (altezza verticale delle bande portata a ±10000 invece
  che ai limiti della vista) e in `js/engine/{rational,irrational,
  composite}.js` (estensione orizzontale a ±10000 solo quando l'estremo
  dell'intervallo coincide col bordo del range di calcolo interno, cioè è
  davvero infinito — gli estremi finiti/le radici vere restano esatti,
  non si allargano).
- **Asintoti disegnati in blu** (verticali, orizzontali, obliqui) invece
  del colore di default/grigio, tramite l'override `attr` sulle
  annotazioni di function-plot (confermato leggendo il sorgente della
  libreria) — i marcatori di dominio escluso (non asintoti) restano
  invariati.
- **Frecce "tende a ±∞" agli angoli del grafico** per il comportamento
  x→±∞ nel passo Limiti (solo questo caso, non vicino agli asintoti
  verticali — scope deciso esplicitamente con l'utente dopo aver spiegato
  il compromesso affidabilità/completezza). Sono elementi DOM ancorati via
  CSS agli angoli di `#graph-wrap` (non ai dati di function-plot), quindi
  restano al bordo del grafico visibile a qualunque zoom senza bisogno di
  agganciarsi allo zoom interno della libreria. `js/engine/rational.js`
  calcola la direzione corretta per lato (segno di m per l'asintoto
  obliquo, parità del grado per la divergenza pura); `js/engine/
  irrational.js` mostra la freccia solo verso l'alto (√g(x) non può
  divergere a -∞) e solo sul lato dove il dominio si estende davvero fino
  a quell'estremo.

### Da fare
- **Verificare visivamente nel browser tutte le modifiche al grafico di
  questa sessione** (zone rosse piene, fix zoom, asintoti blu, frecce agli
  angoli): l'estensione Claude in Chrome è rimasta disconnessa per l'intera
  sessione, quindi è stata verificata solo la sintassi (`node --check`),
  mai il rendering reale. L'utente ha un server locale già avviato
  (`http://localhost:8934`, vedi comandi in cronologia) ma non ha ancora
  dato conferma esplicita che il risultato visivo sia corretto.
- Bug minore UI mobile: lo scroll/wheel sopra il grafico (function-plot)
  viene intercettato dallo zoom/pan del grafico invece di scorrere la
  pagina — su mobile rischia di "intrappolare" l'utente che scorre
  partendo dal grafico. Da sistemare (valutare disabilitare zoom/pan di
  function-plot o limitarlo). Trovato verificando la vista mobile nel
  browser (375×812, via iframe perché Chrome su desktop non permette
  finestre più strette di ~557px).
- Funzioni composte: passi oltre al Dominio (simmetrie, segno, limiti,
  asintoti, derivate) — da affrontare uno alla volta quando l'utente lo
  chiede. Il punto critico anticipato è limiti/asintoti per x→±∞: il
  metodo attuale (confronto gradi numeratore/denominatore) non si
  generalizza alle composte, e math.js non ha un motore di limiti
  simbolico — probabile euristica numerica o gerarchia degli infiniti
  codificata a mano (vedi discussione con l'utente e `percorso.md`
  Modulo 3).
- `log10(x)` via tastiera MathLive (template a pedice) non funziona (vedi
  sopra) — richiede o normalizzare l'ascii-math prodotto o intercettare il
  pattern nell'albero prima del parsing.

### Ultimo task eseguito
Sessione di rifinitura delle spiegazioni e del grafico per i passi
Simmetrie, Intersezioni, Segno e Limiti (razionali/irrazionali), su una
serie di richieste puntuali dell'utente. Il pezzo più corposo: reso
dinamico il `prompt` del passo Limiti (forma indeterminata + metodo, per
punto, in base al tipo di funzione e alla funzione specifica), dopo che un
primo tentativo con teoria statica esaustiva è stato respinto ("troppe
info"). Aggiunte anche le zone rosse piene (dominio/segno) al posto della
linea piatta, un fix per far seguire lo zoom alle bande (prima restavano
ancorate al quadrato -10/10 iniziale), asintoti in blu, e frecce "tende a
±∞" agli angoli del grafico per il passo Limiti. File toccati:
`js/theory.js`, `js/engine/rational.js`, `js/engine/irrational.js`,
`js/engine/composite.js`, `js/ui/graph.js`, `css/style.css`, `index.html`.
Verificata solo la sintassi (`node --check`): l'estensione Claude in
Chrome è rimasta disconnessa per tutta la sessione, **nessuna verifica
visiva nel browser fatta da Claude** (vedi Da fare).

### Prossimo step
Prima di tutto: verificare visivamente nel browser le modifiche al
grafico di questa sessione (vedi Da fare) — non ancora confermato che il
rendering sia corretto. Poi, da concordare con l'utente: (1) prossimo
passo di analisi per le funzioni composte (probabilmente simmetria o
segno prima di affrontare il punto critico di limiti/asintoti); (2)
l'utente valuta di rimuovere il dropdown "esempio guidato" dallo step 1
— non toccare quella parte senza conferma; (3) bug minore scroll sul
grafico in mobile; (4) limite noto `log10(x)` via tastiera (vedi Da
fare).
