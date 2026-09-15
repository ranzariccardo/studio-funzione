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
tastiera simboli integrata — l'output `getValue('ascii-math')` è
direttamente compatibile con `math.parse()`, nessuna conversione necessaria).

**Scope attuale (deliberatamente limitato):** solo funzioni razionali
(polinomiali e fratte) e irrazionali nella forma √g(x). Esponenziali,
logaritmiche, goniometriche, teoremi con dimostrazioni e integrali (presenti
in `percorso.md`) sono roadmap futura — non aggiungerli senza che l'utente
lo chieda esplicitamente.

---

## STRUTTURA FILE

```
sito_mate/
  index.html              # home: campo funzione (math-field) + selettore tipo + avvio
  css/
    style.css              # responsive, mobile-first
  js/
    app.js                 # stato dell'app, routing tra gli step, wiring UI
    theory.js               # teoria condivisa (da percorso.md) tra modalità guidata e calcolata
    engine/
      parser.js             # parsing (math.js), riconoscimento tipo, estrazione coefficienti polinomiali
      roots.js               # ricerca radici (algebrica gradi bassi + numerica), intervalli di segno
      rational.js            # 7 passi calcolati per funzioni razionali (poly/fratte)
      irrational.js          # 7 passi calcolati per funzioni √g(x)
    ui/
      steps.js               # render di un passo (teoria, testo, formule KaTeX) + stepper
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
- Motore di calcolo completo (7 passi: dominio, simmetrie/intersezioni,
  segno, limiti, asintoti, derivata prima/monotonia/estremi, derivata
  seconda/concavità/flessi) per funzioni razionali (poly e fratte) e per
  irrazionali nella forma √g(x)
- Grafico (function-plot) che si aggiorna cumulativamente passo dopo passo
  con le annotazioni del passo corrente (esclusioni dominio, asintoti,
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

### Da fare
- Bug minore UI mobile: lo scroll/wheel sopra il grafico (function-plot)
  viene intercettato dallo zoom/pan del grafico invece di scorrere la
  pagina — su mobile rischia di "intrappolare" l'utente che scorre
  partendo dal grafico. Da sistemare (valutare disabilitare zoom/pan di
  function-plot o limitarlo). Trovato verificando la vista mobile nel
  browser (375×812, via iframe perché Chrome su desktop non permette
  finestre più strette di ~557px).

### Ultimo task eseguito
Attivato GitHub Pages sul repo `studio-funzione` (branch `master`, root),
verificato che l'URL pubblico risponde 200. Il sito è online.

### Prossimo step
Su richiesta esplicita dell'utente: procedere a piccoli passi (una
schermata/funzionalità alla volta, verificare, poi continuare — non
costruire tutto in un unico blocco). Prossimo pezzo da concordare con
l'utente: verifica mobile, poi init git + primo deploy su GitHub Pages.
