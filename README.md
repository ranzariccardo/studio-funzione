# Studio di Funzione — guida passo passo

Sito statico (nessun build, nessun backend) che guida passo-passo nello
studio di funzione. Due modalità:

- **Senza funzione**: scegli un tipo (razionale polinomiale, razionale
  fratta, irrazionale √) e segui teoria + esempio già risolto.
- **Con funzione**: scrivi la tua f(x), il tipo viene riconosciuto in
  automatico e ogni passo (dominio, segno, limiti, asintoti, derivate...)
  viene calcolato davvero sulla tua funzione, con grafico aggiornato passo
  dopo passo.

Tipi supportati ora: funzioni razionali (polinomiali e fratte) e funzioni
irrazionali nella forma √g(x). Altri tipi arriveranno in seguito.

## Sviluppo locale

Basta aprire `index.html` nel browser — nessun server necessario, tutte le
librerie (math.js, KaTeX, function-plot) sono caricate da CDN.

## Deploy

Il sito è pensato per GitHub Pages (branch `main`, root), completamente
gratuito: `https://<utente>.github.io/<nome-repo>/`.
