// Configurazione API - da personalizzare con le proprie credenziali
const API_CONFIG = {
    // Amadeus API Configuration
    amadeus: {
        // Per ambiente di test
        test: {
            baseUrl: 'https://test.api.amadeus.com',
            apiKey: 'XkJ41lnqYnVsArVvvarsCR4wj16gNFFM',
            apiSecret: 'm6HiG4alvAqewv7A'
        },
        
        // Per ambiente di produzione
        production: {
            baseUrl: 'https://api.amadeus.com',
            apiKey: 'YOUR_PRODUCTION_API_KEY',
            apiSecret: 'YOUR_PRODUCTION_API_SECRET'
        }
    },
    
    // Impostazioni generali
    settings: {
        // Usa ambiente di test (cambiare a false per produzione)
        useTestEnvironment: true,
        
        // Numero massimo di risultati per ricerca
        maxResults: 10,
        
        // Timeout per le chiamate API (in millisecondi)
        apiTimeout: 10000,
        
        // Valute supportate
        supportedCurrencies: ['EUR', 'USD', 'GBP'],
        
        // Lingua predefinita
        defaultLanguage: 'it',
        
        // Paesi supportati per la ricerca "Ovunque"
        anywhereCountries: [
            'FR', 'ES', 'GB', 'DE', 'AT', 'CH', 'NL', 'BE', 'CZ', 'HU', 'PT'
        ],
        
        // Città popolari per suggerimenti
        popularCities: [
            { name: 'Parigi', code: 'PAR', country: 'Francia' },
            { name: 'Londra', code: 'LON', country: 'Regno Unito' },
            { name: 'Madrid', code: 'MAD', country: 'Spagna' },
            { name: 'Barcellona', code: 'BCN', country: 'Spagna' },
            { name: 'Amsterdam', code: 'AMS', country: 'Paesi Bassi' },
            { name: 'Vienna', code: 'VIE', country: 'Austria' },
            { name: 'Praga', code: 'PRG', country: 'Repubblica Ceca' },
            { name: 'Budapest', code: 'BUD', country: 'Ungheria' },
            { name: 'Lisbona', code: 'LIS', country: 'Portogallo' },
            { name: 'Berlino', code: 'BER', country: 'Germania' }
        ]
    }
};

// Funzione per ottenere la configurazione API corrente
function getApiConfig() {
    return API_CONFIG.amadeus[API_CONFIG.settings.useTestEnvironment ? 'test' : 'production'];
}

// Funzione per validare la configurazione
function validateApiConfig() {
    const config = getApiConfig();
    
    if (!config.apiKey || config.apiKey === 'YOUR_TEST_API_KEY' || config.apiKey === 'YOUR_PRODUCTION_API_KEY') {
        console.warn('⚠️  API Key non configurata. Aggiorna config.js con le tue credenziali Amadeus.');
        return false;
    }
    
    if (!config.apiSecret || config.apiSecret === 'YOUR_TEST_API_SECRET' || config.apiSecret === 'YOUR_PRODUCTION_API_SECRET') {
        console.warn('⚠️  API Secret non configurato. Aggiorna config.js con le tue credenziali Amadeus.');
        return false;
    }
    
    return true;
}

// Esporta la configurazione per l'uso in altri file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, getApiConfig, validateApiConfig };
}
