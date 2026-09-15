# STUDIO DI FUNZIONE — Corso completo
> Livello avanzato · Stile induttivo (esempio → teoria) · Moduli 0–10

---

## Struttura del progetto

Il corso è organizzato in **11 moduli sequenziali**, costruiti con lo stesso schema:
1. Esempio concreto di apertura
2. Tecnica o procedura applicata all'esempio
3. Teoria e teorema formale
4. Ulteriori esempi progressivi
5. Scheda riepilogo del modulo

Le funzioni usate negli esempi si complicano progressivamente: si parte da razionali semplici (M1) e si arriva a composte con logaritmi, radici ed esponenziali (M7+).

**Funzione filo conduttore (Moduli 1–7):** `f(x) = √(x²-4)·ln(x)/(x-3)`

**Funzione esempio completo (Modulo 7):** `f(x) = (x²-1)/eˣ`

---

## Mappa dei moduli

```
Modulo 0  — Classificazione e proprietà delle funzioni       [Algebra]
Modulo 1  — Dominio e segno                                   [Algebra]
Modulo 2  — Simmetrie, parità e periodicità                  [Algebra]
Modulo 3  — Limiti, continuità, forme indeterminate          [Analisi]
Modulo 4  — Asintoti (V, O, obliqui)                         [Analisi]
Modulo 5  — Derivata prima, crescenza, estremi               [Calcolo diff.]
Modulo 6  — Derivata seconda, concavità, flessi              [Calcolo diff.]
Modulo 7  — Grafico completo e sintesi                       [Sintesi]
───────────────────────────────────────────────────────────────
Modulo 8  — Integrale indefinito e primitive                 [Calcolo int.]
Modulo 9  — Integrale definito e T.F.C.                      [Calcolo int.]
Modulo 10 — Applicazioni geometriche degli integrali         [Calcolo int.]
```

---

## MODULO 0 — Classificazione delle funzioni

### Definizione di funzione
- `f : A → B` associa a ogni `x ∈ A` esattamente un valore `f(x) ∈ B`
- Dominio = A · Codominio = B · Immagine = valori effettivamente assunti
- **Test retta verticale:** una curva è una funzione se ogni verticale la interseca al più una volta

### Schema di classificazione

| Categoria | Sottotipo | Esempi | Dominio |
|---|---|---|---|
| Algebrica | Razionale intera (polinomio) | x², 3x+1 | ℝ |
| Algebrica | Razionale fratta | (x²-1)/(x-1) | ℝ \ {zeri den.} |
| Algebrica | Irrazionale | √(x²-4), ∛(x+1) | Dipende dall'indice |
| Trascendente | Esponenziale | eˣ, 2ˣ | ℝ |
| Trascendente | Logaritmica | ln x, log₂x | (0, +∞) |
| Trascendente | Trigonometrica | sin x, cos x, tan x | ℝ o ℝ\{kπ/2} |
| Composta | Combinazione | ln(sin x), e^(x²) | Intersezione vincoli |

### Regola per le composte
```
Dom(f ∘ g) = { x ∈ Dom(g)  |  g(x) ∈ Dom(f) }
```

### Iniettività, suriettività, funzione inversa
- **Iniettiva:** f(x₁)=f(x₂) ⟹ x₁=x₂ (ogni orizzontale interseca al più una volta)
- **Biettiva:** iniettiva + suriettiva → esiste f⁻¹
- Grafico di f⁻¹ = riflessione di f rispetto alla bisettrice y = x

| Funzione | Dominio ristretto | Inversa | Dom(f⁻¹) |
|---|---|---|---|
| sin x | [-π/2, π/2] | arcsin x | [-1, 1] |
| cos x | [0, π] | arccos x | [-1, 1] |
| tan x | (-π/2, π/2) | arctan x | ℝ |
| eˣ | ℝ | ln x | (0, +∞) |

---

## MODULO 1 — Dominio e segno

### I sei vincoli fondamentali
Il dominio è l'**INTERSEZIONE** di tutti i vincoli imposti da ogni componente.

| Componente | Vincolo | Note |
|---|---|---|
| Radice indice pari √ⁿ | A(x) ≥ 0 | Incluso lo zero |
| Radice indice dispari ∛ | nessuno | Dom = ℝ |
| Denominatore 1/Q(x) | Q(x) ≠ 0 | Punto isolato escluso |
| Logaritmo logₐ(A(x)) | A(x) > 0 | **Strettamente positivo, MAI ≥ 0** |
| Tangente tan(A(x)) | A(x) ≠ π/2+kπ | Famiglia infinita |
| arcsin / arccos (A(x)) | -1 ≤ A(x) ≤ 1 | Vincolo doppio |

### Approfondimento: vincolo del logaritmo
- Motivo: `logₐ(x) = y` significa `aʸ = x`, ma `aʸ > 0` sempre → x deve essere > 0
- `ln(0) = -∞` → non ammesso
- **Casi frequenti:**
  - `ln(ax+b) > 0`: disequazione lineare, vincolo stretto
  - `ln(x²-4) > 0`: studio del polinomio (x<-2 o x>2)
  - `ln(ln(x)) > 0`: vincolo annidato — prima ln(x) > 0 → x > 1
- **Errori tipici:** usare ≥ invece di > · dimenticare il dom interno in composizioni

### Approfondimento: vincolo di tan e cotan
- `tan(x) = sin(x)/cos(x)` → non esiste quando cos(x) = 0, cioè x = π/2 + kπ
- `cotan(x) = cos(x)/sin(x)` → non esiste quando sin(x) = 0, cioè x = kπ
- Per `tan(A(x))`: risolvere `A(x) ≠ π/2 + kπ` con k ∈ ℤ
- In composizioni (`ln(tan x)`): intersecare vincolo del contenitore + vincolo di tan

### Metodo — 5 passi
1. Identifica ogni componente (radici, log, denominatori, trig inversa)
2. Scrivi il vincolo di ciascuna
3. Risolvi ogni disequazione separatamente
4. Rappresenta le soluzioni sulla retta reale
5. Prendi l'intersezione (zona comune a tutti i vincoli)

### Esempio completo: `f(x) = √(x²-4)·ln(x)/(x-3)`
- √(x²-4): x²-4 ≥ 0 → x ≤ -2 o x ≥ 2
- ln(x): x > 0
- 1/(x-3): x ≠ 3
- **Dom(f) = [2, 3) ∪ (3, +∞)**
  - x=2 incluso (√0=0 ammesso) · x=3 escluso (denominatore nullo)

### Studio del segno
- Il segno di un prodotto/quoziente cambia solo dove uno dei fattori cambia segno
- Metodo tabella: zeri dei fattori → intervalli → segno per fattore → prodotto
- Regola: (+)(+)=+ · (+)(-)=- · (-)(-)=+
- Per f sopra: f<0 su (2,3) · f>0 su (3,+∞) · f(2)=0

---

## MODULO 2 — Simmetrie, parità e periodicità

### Funzione pari
- **Definizione:** dominio simmetrico rispetto all'origine E f(-x) = f(x) per ogni x
- **Geometria:** simmetria rispetto all'asse y
- **Segnale rapido:** solo potenze pari di x (0, 2, 4, …), nessun termine dispari
- **Test:** calcola f(-x), confronta con f(x)
- Esempio: `f(x) = x⁴-3x²` → f(-x) = x⁴-3x² = f(x) ✓

### Funzione dispari
- **Definizione:** dominio simmetrico rispetto all'origine E f(-x) = -f(x) per ogni x
- **Geometria:** simmetria rispetto all'origine (rotazione 180°)
- **Segnale rapido:** solo potenze dispari di x (1, 3, 5, …), nessun termine costante
- Esempio: `f(x) = x³-2x` → f(-x) = -x³+2x = -(x³-2x) = -f(x) ✓
- **Nota:** f(x)=0 è l'unica funzione pari E dispari contemporaneamente

### Prerequisito fondamentale
Se il dominio NON è simmetrico rispetto all'origine → né pari né dispari. Il test si ferma al passo 1.

### Procedura algoritmica
1. Verifica che Dom sia simmetrico rispetto all'origine → se NO: né pari né dispari
2. Calcola f(-x) e semplifica
3. Confronta:
   - f(-x) = f(x) → **PARI**
   - f(-x) = -f(x) → **DISPARI**
   - né l'uno né l'altro → **né pari né dispari**

### Periodicità
- **Definizione:** f(x+T) = f(x) per ogni x nel dominio, con T > 0 il periodo minimo
- **Teorema:** se f ha periodo T, allora f(ax+b) ha periodo T/|a|

| Funzione | Periodo |
|---|---|
| sin x, cos x | 2π |
| tan x, cotan x | π |
| sin(ax), cos(ax) | 2π/|a| |
| f(x)+g(x) | mcm(T₁,T₂) — solo se T₁/T₂ ∈ ℚ |

- **Attenzione:** sin(x)+sin(√2·x) **non è periodica** — T₁/T₂ = √2 ∉ ℚ
- La costante b in f(ax+b) non cambia il periodo, solo la fase

### Tabella simmetrie elementari
| Funzione | Tipo | Periodo |
|---|---|---|
| xⁿ (n pari) | pari | — |
| xⁿ (n dispari) | dispari | — |
| sin x | dispari | 2π |
| cos x | pari | 2π |
| tan x | dispari | π |
| \|x\| | pari | — |
| eˣ | né pari né dispari | — |
| ln x | né pari né dispari | — |

---

## MODULO 3 — Limiti, continuità e forme indeterminate

### Definizione rigorosa (ε-δ)
```
lim_{x→x₀} f(x) = L  ⟺  ∀ε>0  ∃δ>0 : 0<|x-x₀|<δ  ⟹  |f(x)-L|<ε
```
- Il limite riguarda il comportamento **vicino** a x₀, non **nel** punto
- Limite esiste ⟺ lim⁻ = lim⁺ = L (limiti laterali coincidono)
- Limite sinistro: x → x₀⁻ · Limite destro: x → x₀⁺

### Teoremi fondamentali
- **Unicità:** se lim f = L e lim f = M allora L = M (il limite è unico)
  - *Dimostrazione per assurdo:* scegli ε = |L-M|/2 → gli intorni di L e M sono disgiunti → contraddizione con la disuguaglianza triangolare
- **Permanenza del segno:** se lim f = L > 0 allora f > 0 in un intorno di x₀
- **Confronto (Carabinieri):** se g ≤ f ≤ h e lim g = lim h = L → lim f = L
- **Algebra dei limiti:** lim(f±g) = limf ± limg (solo se entrambi finiti)

### Le 7 forme indeterminate

#### 0/0 — quoziente di infinitesimi
| Tipo funzione | Tecnica | Esempio |
|---|---|---|
| Razionale | Scomposizione e cancellazione di (x-x₀) | (x²-1)/(x-1) → 2 |
| Con radici | Razionalizzazione: ×(√A+√B)/(√A+√B) | (√x-2)/(x-4) → 1/4 |
| Trig/log/exp vicino a 0 | Limiti notevoli o equivalenti asintotici | sin(3x)/x → 3 |
| Caso ostico | De l'Hôpital: lim f/g = lim f'/g' | (ln x)/(x-1) → 1 |
| Somme di trascendenti | Taylor — sviluppa e cancella | (eˣ-1-x)/x² → 1/2 |

#### ∞/∞ — quoziente di divergenti
- **Polinomi:** dividi per xⁿ (grado max del denominatore)
  - n=m: rapporto coefficienti · n>m: ∞ · n<m: 0
- **Con radici:** √(x²·A) = |x|·√A → per x>0 è x√A; per x<0 è -x√A (**attenzione al segno!**)
- **Exp/log:** gerarchia log ≪ xⁿ ≪ aˣ ≪ xˣ
- **De l'Hôpital** come fallback

#### 0·∞ — prodotto misto
- Riscrivi: f·g = f/(1/g) → 0/0 oppure f·g = g/(1/f) → ∞/∞
- Scegli quale mettere sotto in base alla semplicità di derivazione
- **Regola pratica:** xᵃ·ln(x) → 0 per x→0⁺ per qualsiasi a > 0 (la potenza batte il logaritmo)
- Se il fattore "∞" è limitato (arctan, sin, cos): 0 × limitato = 0 direttamente

#### ∞-∞ — differenza di divergenti
- **Con frazioni:** denominatore comune → forma 0/0
- **Con radici:** moltiplica per il coniugato (√A-√B)(√A+√B) = A-B
- **Con logaritmi:** ln A - ln B = ln(A/B) → elimina la forma
- **Con trascendenti misti:** Taylor → sviluppa e cancella i termini uguali
- **Flowchart:** logaritmi? → coniugato se radici? → den.comune se frazioni? → raccoglimento se exp? → Taylor/De l'Hôpital

#### 1^∞, 0⁰, ∞⁰ — potenze degeneri
- Schema universale: `f^g = e^(g·ln f)` → studia l'esponente (forma 0·∞)
- Per 1^∞: base = 1+α, esp = 1/α → risultato = e^(lim α·esp)
- Per 0⁰: esp·ln(base) è 0·(-∞) → De l'Hôpital
- Per ∞⁰: esp·ln(base) è 0·∞ → stesso metodo

### Limiti notevoli fondamentali (x→0 salvo diversa indicazione)
```
sin(x)/x = 1          tan(x)/x = 1         (1-cos x)/x² = 1/2
arcsin(x)/x = 1       ln(1+x)/x = 1        (eˣ-1)/x = 1
(aˣ-1)/x = ln a       (1+1/n)ⁿ = e  (n→∞)  (1+x)^(1/x) = e
```
**Trucco:** il notevole vale per qualsiasi argomento α(x)→0, non solo x.
Esempio: sin(3x)/x = 3·[sin(3x)/(3x)] → 3·1 = 3

### Equivalenti asintotici per x→0 (f~g: lim f/g = 1)
**Usabili in prodotti e quozienti, MAI in somme o differenze!**
```
sin x ~ x         → sviluppo: x - x³/6 + …
tan x ~ x         → sviluppo: x + x³/3 + …
1-cos x ~ x²/2   → sviluppo: x²/2 - x⁴/24 + …
ln(1+x) ~ x       → sviluppo: x - x²/2 + x³/3 - …
eˣ-1 ~ x          → sviluppo: x + x²/2 + x³/6 + …
arcsin x ~ x       → sviluppo: x + x³/6 + …
arctan x ~ x       → sviluppo: x - x³/3 + …
(1+x)ᵃ-1 ~ ax     → sviluppo: ax + a(a-1)x²/2 + …
```

### Gerarchia degli infiniti (x→+∞)
```
log x  ≪  xᵃ (a>0)  ≪  xᵃ·log x  ≪  aˣ (a>1)  ≪  xˣ  ≪  n!
```
- xⁿ/eˣ → 0 per qualsiasi n (l'esponenziale domina sempre)
- ln(x)/xᵃ → 0 per qualsiasi a > 0 (il logaritmo perde sempre)

### Continuità e punti di discontinuità
f è continua in x₀ se: (1) f(x₀) esiste · (2) lim f(x) esiste finito · (3) lim = f(x₀)

| Specie | Condizione | Grafico | Eliminabile? |
|---|---|---|---|
| I (eliminabile) | lim⁻=lim⁺=L finito, ma f(x₀)≠L o ∄ | Buca o punto spostato | **SÌ** — ridefini f(x₀)=L |
| II (salto) | lim⁻≠lim⁺ (entrambi finiti) | Spacco verticale | NO |
| III (asintoto) | Almeno un limite laterale = ±∞ | Esplosione a ±∞ | NO |

---

## MODULO 4 — Asintoti

### Asintoto verticale x = x₀
- La retta x=x₀ è AV se almeno un limite laterale vale ±∞
- **Dove cercare:** solo nei punti esclusi dal dominio (zeri denominatore, bordi log/radice)
- **Regola del segno:** segno(lim) = segno(N(x₀)) × segno(D→0±)
  - N>0, D→0⁺ → +∞ · N>0, D→0⁻ → -∞ · N<0, D→0⁺ → -∞ · N<0, D→0⁻ → +∞
- I 4 comportamenti: -∞|+∞ (tipo 1/x) · +∞|+∞ (tipo 1/x²) · -∞|-∞ (tipo -1/x²) · +∞|-∞ (tipo -1/x)

### Asintoto orizzontale y = L
- Esiste se lim_{x→±∞} f(x) = L ∈ ℝ
- Una funzione può avere due AO diversi (uno per lato)
- **Regola esclusiva:** AO orizzontale e obliquo si escludono per lo stesso lato

### Asintoto obliquo y = mx + q
- Esiste se lim f(x) = ±∞ ma la funzione cresce linearmente
- **Procedura obbligatoria in 2 passi:**
```
Passo 1: m = lim_{x→±∞} f(x)/x
         m=0: AO orizzontale · m=∞: nessun AO obliquo · m∈ℝ\{0}: procedi

Passo 2: q = lim_{x→±∞} [f(x) - mx]
         q finito: AO obliquo y=mx+q · q=∞: nessun AO obliquo
```

### Esempi chiave
- `(3x+1)/(x-2)` → AO y=3 (stesso grado)
- `arctan x` → y=π/2 (x→+∞) e y=-π/2 (x→-∞) — due AO diversi
- `(x²+2x+1)/(x-1)` → m=1, q=3 → AO obliquo y=x+3
- `√(x²+2x)` → AO y=x+1 (x→+∞) e y=-x-1 (x→-∞)
- `√(x²-4)·ln(x)/(x-3)` → solo AV in x=3; nessun AO né obliquo (cresce come ln x)

---

## MODULO 5 — Derivata prima, crescenza e punti critici

### Definizione
```
f'(x₀) = lim_{h→0} [f(x₀+h) - f(x₀)] / h   (pendenza della tangente)
```
- La secante tra (x₀,f(x₀)) e (x₀+h,f(x₀+h)) → tangente per h→0
- f è derivabile in x₀ se il limite esiste finito

### Regole di derivazione
```
[αf ± βg]' = αf' ± βg'          (linearità)
[f·g]' = f'g + fg'               (prodotto)
[f/g]' = (f'g - fg') / g²        (quoziente)
[f(g(x))]' = f'(g(x))·g'(x)     (catena / composizione)
```

### Derivate elementari
```
Algebriche:
xⁿ → n·xⁿ⁻¹    √x → 1/(2√x)    |x| → x/|x| = sgn(x)    c → 0

Trascendenti:
eˣ → eˣ          aˣ → aˣ·ln a
ln x → 1/x        logₐx → 1/(x·ln a)
sin x → cos x     cos x → -sin x     tan x → 1/cos²x
arcsin x → 1/√(1-x²)    arccos x → -1/√(1-x²)    arctan x → 1/(1+x²)
sinh x → cosh x   cosh x → sinh x
```

### Criterio della derivata prima
- f' > 0 su (a,b) → f **strettamente crescente** ↗
- f' < 0 su (a,b) → f **strettamente decrescente** ↘
- f'(x₀) = 0 + f': +→- → **MASSIMO locale**
- f'(x₀) = 0 + f': -→+ → **MINIMO locale**
- f'(x₀) = 0 + segno costante → **FLESSO orizzontale**

**Attenzione:** f'(x₀)=0 è condizione necessaria per estremo (con derivabilità) — non sufficiente!

### Procedura studio con f'
1. Calcola f'(x)
2. Risolvi f'(x) = 0 → punti critici
3. Individua punti di non derivabilità
4. Tabella dei segni di f' su tutti gli intervalli
5. Classifica ogni punto critico/non-derivabile

### Punti di non derivabilità
Dove f(x₀) esiste ma f'(x₀) non esiste. Si usano le derivate laterali:
- `f'_d(x₀) = lim_{h→0⁺} [f(x₀+h)-f(x₀)]/h`
- `f'_s(x₀) = lim_{h→0⁻} [f(x₀+h)-f(x₀)]/h`

| Tipo | f'ₛ | f'_d | Geometria | Esempio |
|---|---|---|---|---|
| **Angoloso** | L finito | M finito, L≠M | Spigolo | \|x\| in x=0 |
| **Cuspide** | -∞ | +∞ (o viceversa) | Punta acuta verticale | x^(2/3) in x=0 |
| **Flesso verticale** | ±∞ | stesso segno | Tang. verticale, curva attraversa | x^(1/3) in x=0 |
| **Bordo dominio** | ∄ | ±∞ o L | Semi-tangente | √x in x=0 |

**Dove cercarli:** \|A(x)\| negli zeri di A(x) · potenze frazionarie x^(p/q) con p/q<1 · funzioni a tratti nei punti di giunzione

### Teoremi fondamentali sulle derivate

#### Catena logica
```
Fermat → Rolle → Lagrange → [Corollari] → Cauchy → De l'Hôpital → Taylor
```

#### Teorema di Fermat
- **Enunciato:** x₀ estremo locale + f derivabile in x₀ → f'(x₀) = 0
- **Dimostrazione:** per max locale, f'_d ≤ 0 e f'_s ≥ 0 → per derivabilità f'(x₀) = 0
- **Attenzione:** f'(x₀)=0 ⟹ estremo è **FALSO** (controesempio: x³, flesso in 0)

#### Teorema di Rolle
- **Ipotesi:** f continua su [a,b] · derivabile su (a,b) · f(a)=f(b)
- **Tesi:** ∃c ∈ (a,b) tale che f'(c) = 0
- **Dimostrazione:** Weierstrass → M e m esistono; se M=m: f costante; altrimenti uno è interno → Fermat

#### Teorema di Lagrange (valor medio)
- **Tesi:** ∃c ∈ (a,b) tale che `f'(c) = [f(b)-f(a)]/(b-a)`
- **Dimostrazione:** funzione ausiliaria g(x) = f(x) - retta secante → soddisfa Rolle
- **Interpretazione:** esiste un punto dove la velocità istantanea = velocità media

#### Corollari di Lagrange (fondamento della monotonia!)
- f'=0 su (a,b) → f **costante**
- f'>0 su (a,b) → f **strettamente crescente**
- f'=g' su (a,b) → f = g + C (unicità della primitiva)

#### Teorema di Cauchy
- `[f(b)-f(a)] / [g(b)-g(a)] = f'(c)/g'(c)` per qualche c interno
- Generalizza Lagrange; fonda De l'Hôpital

#### Regola di De l'Hôpital
- **Vale solo per:** 0/0 o ∞/∞ (non per altre forme!)
- `lim f/g = lim f'/g'` (si derivano numeratore e denominatore **separatamente**)
- Si può applicare più volte se rimane la forma indeterminata
- **Errore comune:** derivare il rapporto f/g invece di f e g separatamente

#### Formula di Taylor-MacLaurin
```
f(x) = f(x₀) + f'(x₀)(x-x₀) + f''(x₀)/2!(x-x₀)² + … + f⁽ⁿ⁾(x₀)/n!(x-x₀)ⁿ + o((x-x₀)ⁿ)
```
Per x₀=0 (MacLaurin):
```
eˣ     = 1 + x + x²/2! + x³/3! + … + xⁿ/n! + o(xⁿ)
sin x  = x - x³/3! + x⁵/5! - … + o(x²ⁿ)
cos x  = 1 - x²/2! + x⁴/4! - … + o(x²ⁿ⁺¹)
ln(1+x)= x - x²/2 + x³/3 - x⁴/4 + … + o(xⁿ)
(1+x)ᵃ = 1 + ax + a(a-1)/2! x² + … + o(xⁿ)
```

---

## MODULO 6 — Derivata seconda, concavità e flessi

### Definizione e significato
- f''(x) = [f'(x)]' — derivata della derivata prima
- **Misura:** velocità di variazione della pendenza (accelerazione della funzione)
- f'' > 0 → pendenza crescente → funzione **CONVESSA (∪)** → curva SOTTO le tangenti
- f'' < 0 → pendenza decrescente → funzione **CONCAVA (∩)** → curva SOPRA le tangenti

### Teorema — criterio per la concavità
- f'' > 0 su (a,b) ⟺ f strettamente convessa su (a,b)
- **Dimostrazione:** Taylor al 2° ordine: f(x) = f(x₀)+f'(x₀)(x-x₀)+f''(c)/2·(x-x₀)² → se f''>0, il termine quadratico è positivo → f(x) > retta tangente

### Punti di flesso — cambio di concavità
- x₀ è flesso se f'' cambia segno in x₀
- **Condizione necessaria** (se f'' esiste): f''(x₀) = 0
- **NON sufficiente:** f(x)=x⁴ ha f''(0)=0 ma f''≥0 sempre → nessun flesso

| Tipo | f'(x₀) | f'' intorno | Tangente |
|---|---|---|---|
| Flesso orizzontale | = 0 | cambia segno | Orizzontale |
| Flesso obliquo | ≠ 0 | cambia segno | Obliqua |

### Criterio del secondo ordine per gli estremi
| Condizione | Conclusione |
|---|---|
| f'(x₀)=0 e f''(x₀) > 0 | **MINIMO locale** — ∪ in x₀ |
| f'(x₀)=0 e f''(x₀) < 0 | **MASSIMO locale** — ∩ in x₀ |
| f'(x₀)=0 e f''(x₀) = 0 | **INCONCLUDENTE** — torna al segno di f' |

**Dimostrazione:** Taylor al 2° ordine con f'(x₀)=0 → f(x)-f(x₀) = f''(x₀)/2·(x-x₀)² + o → se f''>0, il termine domina → f(x)>f(x₀) → minimo

### Tabella combinazioni f' e f''
| f' | f'' | Comportamento | Forma |
|---|---|---|---|
| + | + | Cresce con acc. crescente | ↗ ∪ |
| + | - | Cresce con acc. decrescente | ↗ ∩ |
| - | + | Decresce con acc. crescente | ↘ ∪ |
| - | - | Decresce con acc. decrescente | ↘ ∩ |

### Esempio: `f(x) = x⁴ - 4x³`
- f'(x) = 4x²(x-3) → critici: x=0, x=3
- f''(x) = 12x(x-2) → zeri: x=0, x=2
- In x=0: f''(0)=0 → inconcludente → dal segno di f': flesso orizzontale
- In x=3: f''(3)=36>0 → minimo locale, f(3)=-27
- Flesso obliquo in x=2 (f'' cambia ∩→∪), f(2)=-16

---

## MODULO 7 — Grafico completo e sintesi

### Procedura completa in 7 passi
```
① Classificazione e dominio    → tipo · vincoli · intersezioni con assi
② Segno · simmetrie · period.  → f>0/f<0 · pari/dispari · periodo T
③ Limiti agli estremi          → x→±∞ · bordi del dominio
④ Asintoti                     → V (punti esclusi) · O (lim finito) · obliqui (m,q)
⑤ Derivata prima               → f'=0 · segno · crescenza · estremi
⑥ Derivata seconda             → f''=0 · concavità · flessi
⑦ Grafico                      → traccia · verifica coerenza
```

### Verifica di coerenza (checklist finale)
- ✓ Segno coerente col grafico (f>0 dove previsto)
- ✓ Limiti coerenti (rami nelle direzioni giuste)
- ✓ Crescenza rispettata (↗↘ coerenti con posizione di min/max)
- ✓ Concavità rispettata (∪∩ nei giusti intervalli)
- ✓ Estremi confermati dal criterio (f'=0 e segno di f'')
- ✓ Asintoti: il grafico si avvicina alle rette senza toccarle

### Esempio completo: `f(x) = (x²-1)/eˣ`

| Elemento | Risultato |
|---|---|
| Dominio | ℝ (eˣ≠0 sempre) |
| Intersezioni | Asse x: x=±1 · Asse y: f(0)=-1 |
| Segno | f>0 su (-∞,-1)∪(1,+∞) · f<0 su (-1,1) |
| Simmetrie | Né pari né dispari · Non periodica |
| lim x→+∞ | 0 → **AO: y=0** |
| lim x→-∞ | +∞ (forma +∞/0⁺, non indeterminata) |
| Asintoti | AO: y=0 · nessun AV · nessun obliquo |
| f'(x) | (-x²+2x+1)/eˣ → critici: x=1±√2 |
| Minimo | x=1-√2≈-0.41, f≈-0.19 |
| Massimo | x=1+√2≈2.41, f≈0.57 |
| f''(x) | (x²-4x+1)/eˣ → zeri: x=2±√3 |
| Flesso | x=2-√3≈0.27 e x=2+√3≈3.73 |
| Concavità | ∪ · ∩ · ∪ (nei tre intervalli) |

**Tavola sinottica:**
```
(-∞,1-√2):   f'−  f''+  →  ↘∪
x=1-√2:      MIN  f≈-0.19
(1-√2,2-√3): f'+  f''+  →  ↗∪
x=2-√3:      FLESSO  f≈-0.09
(2-√3,1+√2): f'+  f''−  →  ↗∩
x=1+√2:      MAX  f≈0.57
(1+√2,2+√3): f'−  f''−  →  ↘∩
x=2+√3:      FLESSO  f≈0.44
(2+√3,+∞):   f'−  f''+  →  ↘∪  →  0
```

---

## MODULI 8–10 — Integrale calcolo (da sviluppare)

### Modulo 8 — Integrale indefinito e primitive
- Concetto di primitiva e teorema di esistenza
- Integrale immediato (tabella delle primitive elementari)
- Integrazione per sostituzione
- Integrazione per parti: ∫u·dv = u·v - ∫v·du
- Frazioni parziali (funzioni razionali fratte)
- Integrali trigonometrici

### Modulo 9 — Integrale definito e T.F.C.
- Somme di Riemann e definizione integrale definito
- Teorema fondamentale del calcolo integrale
- Formula di Leibniz-Newton: ∫ₐᵇ f(x)dx = F(b)-F(a)
- Integrali impropri (funzioni illimitate o su intervalli illimitati)

### Modulo 10 — Applicazioni geometriche
- Calcolo di aree tra curve
- Volumi di solidi di rotazione (metodo dischi e gusci cilindrici)
- Lunghezza di un arco di curva

---

## Note metodologiche

### Stile del corso
- **Approccio induttivo:** ogni modulo parte da un esempio concreto, poi risale alla teoria
- **Livello:** avanzato — teoremi con dimostrazioni, rigore formale
- **Funzioni trattate:** razionali intere/fratte, irrazionali, trascendenti (log/exp/trig), composte
- **Esempi progressivi:** si parte semplice e si arriva a funzioni complesse

### Approfondimenti completati nel corso
- Vincolo del logaritmo (3 casi, errori tipici, logaritmo composto annidato)
- Vincolo della tangente (geometria del cerchio unitario, 4 casi pratici)
- Discontinuità: tutti e 3 i tipi con esempi (eliminabile/salto/asintoto)
- Forma 0/0: tutte le 5 tecniche con esempi progressivi
- Forma ∞/∞: 4 tecniche con gerarchia degli infiniti
- Forma 0·∞: riscrittura come quoziente, 7 esempi
- Forma ∞-∞: 4 tecniche (denominatore comune, coniugato, Taylor, raccoglimento)
- Punti di non derivabilità: 4 tipi con flowchart decisionale
- Teoremi sulle derivate: catena logica completa con dimostrazioni

### Deliverable pianificati
- [x] Documento Word (Moduli 0–7) — StudioFunzione_Completo.docx
- [ ] Moduli 8–10 da sviluppare
- [ ] Pagina HTML interattiva completa (GitHub Pages)
