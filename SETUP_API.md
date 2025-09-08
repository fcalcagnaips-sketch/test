# 🚀 Setup API Amadeus - Guida Passo-Passo

## 1. Ottenere le Credenziali Amadeus

1. **Vai su**: [developers.amadeus.com](https://developers.amadeus.com)
2. **Crea un account** gratuito
3. **Crea una nuova app**:
   - Clicca su "Create New App"
   - Scegli un nome per la tua app (es. "PlanMyTrip")
   - Seleziona "Flight Search" e "Hotel Search" come API
4. **Copia le credenziali**:
   - `API Key` (es. `AbCdEfGhIjKlMnOp`)
   - `API Secret` (es. `1234567890AbCdEf`)

## 2. Configurare il Sito

### Opzione A: Modifica Manuale
Apri il file `config.js` e sostituisci:

```javascript
// Cerca queste righe:
apiKey: 'YOUR_TEST_API_KEY',
apiSecret: 'YOUR_TEST_API_SECRET'

// Sostituisci con:
apiKey: 'LA_TUA_API_KEY_REALE',
apiSecret: 'IL_TUO_API_SECRET_REALE'
```

### Opzione B: Copia e Incolla Veloce
Sostituisci **tutto** il blocco test con:

```javascript
test: {
    baseUrl: 'https://test.api.amadeus.com',
    apiKey: 'LA_TUA_API_KEY_QUI',
    apiSecret: 'IL_TUO_API_SECRET_QUI'
},
```

## 3. Verifica Configurazione

1. **Apri il sito** nel browser
2. **Apri la Console** (F12 → Console)
3. **Cerca questi messaggi**:
   - ✅ `API configurata correttamente` = Tutto OK!
   - ⚠️ `Modalità demo attiva` = Credenziali non configurate

## 4. Test del Sito

### Test Semplice
- **Partenza**: Milano
- **Destinazione**: Parigi  
- **Date**: Domani + 3 giorni
- **Persone**: 2
- **Budget**: €800

### Test "Ovunque"
- **Partenza**: Roma
- **Destinazione**: ✅ Ovunque
- **Date**: Weekend prossimo
- **Persone**: 1
- **Budget**: €500

## 5. Risoluzione Problemi

### Errore: "API Key non configurata"
- Controlla di aver sostituito `YOUR_TEST_API_KEY`
- Assicurati di non aver lasciato spazi extra

### Errore: "401 Unauthorized"
- Verifica che API Key e Secret siano corretti
- Controlla di aver copiato tutto senza spazi

### Errore: "CORS"
- Usa un server HTTP locale (non aprire direttamente il file)
- Comando: `python3 -m http.server 8000`

### Nessun Risultato
- Le API di test hanno dati limitati
- Prova con città comuni (Milano, Roma, Parigi, Londra)
- Verifica che le date siano future

## 6. Limiti API Gratuita

- **2.000 chiamate/mese** (circa 65 ricerche al giorno)
- **Solo dati di test** (non prenotazioni reali)
- **Destinazioni limitate** nell'ambiente test

## 7. Modalità Produzione

Per usare dati reali:
1. **Upgrade** al piano a pagamento su Amadeus
2. **Ottieni credenziali produzione**
3. **Modifica config.js**:
   ```javascript
   useTestEnvironment: false
   ```
4. **Inserisci credenziali produzione**

## 8. Supporto

Se hai problemi:
1. **Controlla la console** del browser per errori
2. **Verifica le credenziali** su developers.amadeus.com
3. **Prova prima con dati simulati** per verificare che il sito funzioni

---

## ⚡ Quick Start

Se hai già le credenziali:

1. **Copia la tua API Key**
2. **Apri `config.js`**
3. **Sostituisci `YOUR_TEST_API_KEY`** con la tua key
4. **Sostituisci `YOUR_TEST_API_SECRET`** con il tuo secret
5. **Salva e ricarica il sito**
6. **Dovresti vedere** "✅ API configurata correttamente" nella console

Fatto! Il tuo sito ora usa dati reali! 🎉