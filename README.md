# PlanMyTrip - Pianificatore di Viaggi

Un'applicazione web moderna per pianificare viaggi in base a parametri essenziali come budget, destinazione, date e numero di persone.

## Caratteristiche

- **Ricerca flessibile**: Cerca per destinazione specifica o seleziona "Ovunque"
- **Budget-oriented**: Trova opzioni che rispettano il budget totale
- **Risultati completi**: Include trasporto (voli, treni, autobus) e alloggi
- **Ordinamento**: Ordina per prezzo, durata o valutazione
- **Design responsive**: Ottimizzato per desktop, tablet e mobile
- **UI moderna**: Interfaccia intuitiva e accattivante

## Funzionalità

### Form di Ricerca
- Città di partenza (obbligatorio)
- Destinazione o checkbox "Ovunque"
- Date di partenza e ritorno
- Numero di persone (1-6+)
- Budget totale in Euro

### Risultati
Ogni opzione di viaggio mostra:
- Nome della destinazione
- Dettagli del trasporto con orari
- Informazioni sull'alloggio con valutazioni
- Prezzo totale per tutte le persone
- Link per prenotare

### Ordinamento
- Prezzo più basso
- Durata del viaggio
- Valutazione dell'alloggio

## Setup per Produzione

### 1. Registrazione API Amadeus

1. Vai su [developers.amadeus.com](https://developers.amadeus.com)
2. Crea un account gratuito
3. Crea una nuova applicazione
4. Ottieni le credenziali API:
   - `API Key`
   - `API Secret`

### 2. Configurazione

Nel file `script.js`, sostituisci:
```javascript
this.apiKey = 'YOUR_AMADEUS_API_KEY';
this.apiSecret = 'YOUR_AMADEUS_API_SECRET';
```

Con le tue credenziali reali.

### 3. API Endpoints Utilizzati

- **Flight Search**: `/v2/shopping/flight-offers`
- **Hotel Search**: `/v3/shopping/hotel-offers`
- **City Search**: `/v1/reference-data/locations/cities`
- **Airport Search**: `/v1/reference-data/locations`

### 4. Limitazioni API Gratuite

Il piano gratuito di Amadeus include:
- 2.000 chiamate API/mese
- Accesso alle API di test
- Supporto per voli, hotel e destinazioni

## Struttura del Progetto

```
/
├── index.html          # Pagina principale
├── styles.css          # Stili CSS
├── script.js           # Logica JavaScript
└── README.md           # Documentazione
```

## Tecnologie Utilizzate

- **HTML5**: Struttura semantica
- **CSS3**: Stili moderni con Flexbox/Grid
- **JavaScript ES6+**: Logica dell'applicazione
- **Font Awesome**: Icone
- **Google Fonts**: Typography (Inter)

## Caratteristiche Tecniche

### Responsive Design
- Mobile-first approach
- Breakpoint: 768px (tablet), 480px (mobile)
- Layout adattivo con CSS Grid

### Performance
- Caricamento asincrono dei risultati
- Animazioni CSS ottimizzate
- Lazy loading delle immagini (se implementate)

### UX/UI
- Loading states con spinner
- Feedback visivo per le interazioni
- Validazione form in tempo reale
- Messaggi di errore chiari

## Deployment

### Hosting Statico
Il sito può essere hostato su:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

### CORS e Sicurezza
Per produzione, implementa:
- Proxy server per le chiamate API
- Variabili d'ambiente per le credenziali
- Rate limiting
- Caching delle risposte API

## Miglioramenti Futuri

1. **Mappe interattive** con Leaflet/Google Maps
2. **Filtri avanzati** (tipo di trasporto, categoria hotel)
3. **Confronto prezzi** tra diversi periodi
4. **Salvataggio preferiti** con localStorage
5. **Condivisione risultati** via URL
6. **Notifiche prezzi** per date flessibili
7. **Integrazione calendario** per date disponibili
8. **Multi-lingua** (attualmente in italiano)

## Supporto Browser

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Licenza

Questo progetto è rilasciato sotto licenza MIT.