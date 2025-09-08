// Travel Planning Application
class TravelPlanner {
    constructor() {
        // Usa la configurazione dal file config.js
        const apiConfig = getApiConfig();
        this.apiKey = apiConfig.apiKey;
        this.apiSecret = apiConfig.apiSecret;
        this.baseUrl = apiConfig.baseUrl;
        this.accessToken = null;
        this.searchResults = [];
        
        // Valida la configurazione API
        if (!validateApiConfig()) {
            console.log('🔧 Modalità demo attiva - usando dati simulati');
            this.demoMode = true;
        } else {
            console.log('✅ API configurata correttamente');
            this.demoMode = false;
        }
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setMinDates();
    }

    setupEventListeners() {
        const form = document.getElementById('search-form');
        const anywhereCheckbox = document.getElementById('anywhere');
        const destinationInput = document.getElementById('destination-city');
        const sortSelect = document.getElementById('sort-by');

        form.addEventListener('submit', (e) => this.handleSearch(e));
        anywhereCheckbox.addEventListener('change', (e) => this.toggleDestination(e));
        sortSelect.addEventListener('change', (e) => this.sortResults(e.target.value));
    }

    setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('departure-date').min = today;
        document.getElementById('return-date').min = today;

        document.getElementById('departure-date').addEventListener('change', (e) => {
            document.getElementById('return-date').min = e.target.value;
        });
    }

    toggleDestination(e) {
        const destinationInput = document.getElementById('destination-city');
        if (e.target.checked) {
            destinationInput.disabled = true;
            destinationInput.value = '';
            destinationInput.placeholder = 'Ovunque - Lascia che ti sorprendiamo!';
        } else {
            destinationInput.disabled = false;
            destinationInput.placeholder = 'Parigi, Londra, Madrid...';
        }
    }

    async handleSearch(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const searchParams = {
            departure: formData.get('departure-city'),
            destination: formData.get('anywhere') ? null : formData.get('destination-city'),
            departureDate: formData.get('departure-date'),
            returnDate: formData.get('return-date'),
            travelers: parseInt(formData.get('travelers')),
            budget: parseFloat(formData.get('budget')),
            anywhere: formData.get('anywhere') === 'on'
        };

        // Validazione
        if (!this.validateSearchParams(searchParams)) {
            return;
        }

        this.showLoading();
        
        try {
            let results;
            if (this.demoMode) {
                // Usa dati simulati se le API non sono configurate
                results = await this.searchTravelOptions(searchParams);
            } else {
                // Usa API reali Amadeus
                results = await this.searchRealTravelOptions(searchParams);
            }
            this.displayResults(results);
        } catch (error) {
            console.error('Errore durante la ricerca:', error);
            this.showError('Si è verificato un errore durante la ricerca. Riprova più tardi.');
        }
    }

    validateSearchParams(params) {
        if (!params.departure.trim()) {
            alert('Inserisci la città di partenza');
            return false;
        }

        if (!params.anywhere && !params.destination.trim()) {
            alert('Inserisci la destinazione o seleziona "Ovunque"');
            return false;
        }

        const depDate = new Date(params.departureDate);
        const retDate = new Date(params.returnDate);
        
        if (retDate <= depDate) {
            alert('La data di ritorno deve essere successiva alla data di partenza');
            return false;
        }

        if (params.budget < 100) {
            alert('Il budget minimo è di 100€');
            return false;
        }

        return true;
    }

    // Simulazione di ricerca - in produzione userebbe le API di Amadeus
    async searchTravelOptions(params) {
        // Simula delay API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Dati simulati - in produzione questi verrebbero dalle API
        const mockDestinations = params.anywhere ? 
            ['Parigi', 'Londra', 'Madrid', 'Barcellona', 'Amsterdam', 'Vienna', 'Praga', 'Budapest'] :
            [params.destination];

        const mockResults = [];

        for (let dest of mockDestinations) {
            // Calcola prezzo base casuale
            const basePrice = Math.floor(Math.random() * 800) + 200;
            const totalPrice = basePrice * params.travelers;

            // Salta se supera il budget
            if (totalPrice > params.budget) continue;

            const result = {
                destination: dest,
                totalPrice: totalPrice,
                pricePerPerson: basePrice,
                transport: this.generateMockTransport(params.departure, dest, params.departureDate, params.returnDate),
                accommodation: this.generateMockAccommodation(dest, params.departureDate, params.returnDate, params.travelers),
                duration: this.calculateDuration(params.departureDate, params.returnDate)
            };

            mockResults.push(result);
        }

        return mockResults.slice(0, 8); // Limita a 8 risultati
    }

    generateMockTransport(from, to, depDate, retDate) {
        const transports = ['Volo', 'Treno', 'Autobus'];
        const type = transports[Math.floor(Math.random() * transports.length)];
        
        const depTime = `${Math.floor(Math.random() * 12) + 6}:${Math.random() < 0.5 ? '00' : '30'}`;
        const retTime = `${Math.floor(Math.random() * 12) + 6}:${Math.random() < 0.5 ? '00' : '30'}`;
        
        let duration = '';
        if (type === 'Volo') {
            duration = `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}min`;
        } else if (type === 'Treno') {
            duration = `${Math.floor(Math.random() * 8) + 3}h ${Math.floor(Math.random() * 60)}min`;
        } else {
            duration = `${Math.floor(Math.random() * 12) + 8}h ${Math.floor(Math.random() * 60)}min`;
        }

        return {
            type: type,
            departure: `${from} ${depTime}`,
            arrival: `${to} ${parseInt(depTime) + 2}:${depTime.split(':')[1]}`,
            return: `${to} ${retTime}`,
            returnArrival: `${from} ${parseInt(retTime) + 2}:${retTime.split(':')[1]}`,
            duration: duration,
            company: this.getTransportCompany(type)
        };
    }

    generateMockAccommodation(city, depDate, retDate, travelers) {
        const types = ['Hotel', 'B&B', 'Appartamento', 'Ostello'];
        const type = types[Math.floor(Math.random() * types.length)];
        const rating = (Math.random() * 2 + 3).toFixed(1); // Rating tra 3.0 e 5.0
        const stars = Math.floor(Math.random() * 3) + 3; // 3-5 stelle
        
        const names = {
            'Hotel': [`Hotel ${city} Center`, `Grand Hotel ${city}`, `${city} Palace Hotel`],
            'B&B': [`B&B Casa ${city}`, `${city} Home B&B`, `Cozy ${city} B&B`],
            'Appartamento': [`${city} City Apartment`, `Modern ${city} Flat`, `${city} Central Apt`],
            'Ostello': [`${city} Hostel`, `Backpackers ${city}`, `Youth Hostel ${city}`]
        };

        return {
            type: type,
            name: names[type][Math.floor(Math.random() * names[type].length)],
            rating: parseFloat(rating),
            stars: stars,
            reviews: Math.floor(Math.random() * 500) + 50,
            amenities: this.getAmenities(type)
        };
    }

    getTransportCompany(type) {
        const companies = {
            'Volo': ['Alitalia', 'Ryanair', 'EasyJet', 'Lufthansa'],
            'Treno': ['Trenitalia', 'Italo', 'SNCF', 'Deutsche Bahn'],
            'Autobus': ['FlixBus', 'Eurolines', 'Megabus', 'MarinoBus']
        };
        const companyList = companies[type];
        return companyList[Math.floor(Math.random() * companyList.length)];
    }

    getAmenities(type) {
        const amenities = {
            'Hotel': ['WiFi gratuito', 'Colazione inclusa', 'Parcheggio', 'Palestra'],
            'B&B': ['WiFi gratuito', 'Colazione inclusa', 'Giardino', 'Terrazza'],
            'Appartamento': ['WiFi gratuito', 'Cucina attrezzata', 'Lavatrice', 'Balcone'],
            'Ostello': ['WiFi gratuito', 'Cucina comune', 'Lavanderia', 'Area comune']
        };
        return amenities[type];
    }

    calculateDuration(depDate, retDate) {
        const dep = new Date(depDate);
        const ret = new Date(retDate);
        const diffTime = Math.abs(ret - dep);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('no-results').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    displayResults(results) {
        this.hideLoading();
        this.searchResults = results;

        if (results.length === 0) {
            document.getElementById('no-results').classList.remove('hidden');
            return;
        }

        const resultsSection = document.getElementById('results-section');
        const resultsContainer = document.getElementById('results-container');
        
        resultsContainer.innerHTML = '';
        
        results.forEach(result => {
            const tripElement = this.createTripElement(result);
            resultsContainer.appendChild(tripElement);
        });

        resultsSection.classList.remove('hidden');
    }

    createTripElement(trip) {
        const tripDiv = document.createElement('div');
        tripDiv.className = 'trip-option';
        
        tripDiv.innerHTML = `
            <div class="trip-header">
                <div class="destination-name">
                    <i class="fas fa-map-marker-alt"></i>
                    ${trip.destination}
                </div>
                <div class="total-price">€${trip.totalPrice}</div>
            </div>
            
            <div class="trip-details">
                <div class="transport-info">
                    <div class="info-title">
                        <i class="fas fa-${this.getTransportIcon(trip.transport.type)}"></i>
                        Trasporto - ${trip.transport.type}
                    </div>
                    <div class="transport-details">
                        <strong>${trip.transport.company}</strong><br>
                        <strong>Andata:</strong> ${trip.transport.departure} → ${trip.transport.arrival}<br>
                        <strong>Ritorno:</strong> ${trip.transport.return} → ${trip.transport.returnArrival}<br>
                        <strong>Durata:</strong> ${trip.transport.duration}
                    </div>
                </div>
                
                <div class="accommodation-info">
                    <div class="info-title">
                        <i class="fas fa-bed"></i>
                        Alloggio - ${trip.accommodation.type}
                    </div>
                    <div class="accommodation-details">
                        <strong>${trip.accommodation.name}</strong><br>
                        <div class="rating">
                            <div class="stars">${this.generateStars(trip.accommodation.stars)}</div>
                            <span>${trip.accommodation.rating}/5 (${trip.accommodation.reviews} recensioni)</span>
                        </div>
                        <div style="margin-top: 8px;">
                            ${trip.accommodation.amenities.slice(0, 2).join(' • ')}
                        </div>
                    </div>
                </div>
            </div>
            
            <button class="book-btn" onclick="window.open('https://www.booking.com', '_blank')">
                <i class="fas fa-external-link-alt"></i>
                Prenota ora - €${trip.pricePerPerson}/persona
            </button>
        `;

        return tripDiv;
    }

    getTransportIcon(type) {
        const icons = {
            'Volo': 'plane',
            'Treno': 'train',
            'Autobus': 'bus'
        };
        return icons[type] || 'car';
    }

    generateStars(count) {
        return '★'.repeat(count) + '☆'.repeat(5 - count);
    }

    sortResults(sortBy) {
        if (!this.searchResults.length) return;

        let sortedResults = [...this.searchResults];

        switch (sortBy) {
            case 'price':
                sortedResults.sort((a, b) => a.totalPrice - b.totalPrice);
                break;
            case 'duration':
                sortedResults.sort((a, b) => a.duration - b.duration);
                break;
            case 'rating':
                sortedResults.sort((a, b) => b.accommodation.rating - a.accommodation.rating);
                break;
        }

        this.displayResults(sortedResults);
    }

    showError(message) {
        this.hideLoading();
        alert(message);
    }

    // Metodo per ricerca con API reali Amadeus
    async searchRealTravelOptions(params) {
        try {
            // Ottieni il token di accesso
            await this.getAmadeusToken();
            
            // Converti nomi città in codici aeroportuali
            const originCode = await this.getCityCode(params.departure);
            let destinationCodes = [];
            
            if (params.anywhere) {
                // Per "Ovunque", usa le città popolari dalla configurazione
                destinationCodes = API_CONFIG.settings.popularCities.map(city => city.code);
            } else {
                const destCode = await this.getCityCode(params.destination);
                destinationCodes = [destCode];
            }
            
            const results = [];
            
            // Cerca voli per ogni destinazione
            for (let destCode of destinationCodes) {
                try {
                    const flightOffers = await this.searchFlights(
                        originCode, 
                        destCode, 
                        params.departureDate, 
                        params.returnDate, 
                        params.travelers
                    );
                    
                    if (flightOffers.data && flightOffers.data.length > 0) {
                        // Cerca hotel per la stessa destinazione
                        const hotelOffers = await this.searchHotels(
                            destCode,
                            params.departureDate,
                            params.returnDate,
                            params.travelers
                        );
                        
                        // Combina voli e hotel in offerte complete
                        const combinedOffers = this.combineFlightAndHotelOffers(
                            flightOffers.data,
                            hotelOffers.data || [],
                            params.budget,
                            params.travelers
                        );
                        
                        results.push(...combinedOffers);
                    }
                } catch (error) {
                    console.warn(`Errore ricerca per ${destCode}:`, error);
                    // Continua con le altre destinazioni
                }
            }
            
            // Filtra per budget e ordina per prezzo
            return results
                .filter(offer => offer.totalPrice <= params.budget)
                .sort((a, b) => a.totalPrice - b.totalPrice)
                .slice(0, API_CONFIG.settings.maxResults);
                
        } catch (error) {
            console.error('Errore API Amadeus:', error);
            // Fallback ai dati simulati in caso di errore
            console.log('Fallback a dati simulati...');
            return await this.searchTravelOptions(params);
        }
    }

    // Converte nome città in codice aeroportuale
    async getCityCode(cityName) {
        if (!this.accessToken) {
            await this.getAmadeusToken();
        }
        
        try {
            const url = `${this.baseUrl}/v1/reference-data/locations?subType=CITY&keyword=${encodeURIComponent(cityName)}&max=1`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                return data.data[0].iataCode;
            }
            
            // Fallback per città comuni
            const commonCities = {
                'milano': 'MXP',
                'roma': 'FCO',
                'napoli': 'NAP',
                'venezia': 'VCE',
                'firenze': 'FLR',
                'parigi': 'PAR',
                'londra': 'LON',
                'madrid': 'MAD',
                'barcellona': 'BCN',
                'amsterdam': 'AMS'
            };
            
            return commonCities[cityName.toLowerCase()] || 'MXP';
        } catch (error) {
            console.warn('Errore ricerca codice città:', error);
            return 'MXP'; // Fallback Milano
        }
    }

    // Combina offerte voli e hotel
    combineFlightAndHotelOffers(flights, hotels, budget, travelers) {
        const results = [];
        
        flights.forEach(flight => {
            const flightPrice = parseFloat(flight.price.total);
            const remainingBudget = budget - (flightPrice * travelers);
            
            if (remainingBudget > 0) {
                // Trova hotel compatibili con il budget rimanente
                const compatibleHotels = hotels.filter(hotel => {
                    const hotelPrice = hotel.offers && hotel.offers[0] ? 
                        parseFloat(hotel.offers[0].price.total) : 100;
                    return hotelPrice <= remainingBudget;
                });
                
                const hotel = compatibleHotels.length > 0 ? 
                    compatibleHotels[0] : this.generateMockHotel();
                
                const hotelPrice = hotel.offers && hotel.offers[0] ? 
                    parseFloat(hotel.offers[0].price.total) : 100;
                
                const totalPrice = (flightPrice * travelers) + hotelPrice;
                
                if (totalPrice <= budget) {
                    results.push({
                        destination: this.getDestinationName(flight.itineraries[0].segments[0].arrival.iataCode),
                        totalPrice: Math.round(totalPrice),
                        pricePerPerson: Math.round(totalPrice / travelers),
                        transport: this.formatFlightTransport(flight),
                        accommodation: this.formatHotelAccommodation(hotel),
                        duration: this.calculateFlightDuration(flight)
                    });
                }
            }
        });
        
        return results;
    }

    // Formatta i dati del volo per la visualizzazione
    formatFlightTransport(flight) {
        const outbound = flight.itineraries[0];
        const inbound = flight.itineraries[1] || outbound;
        
        return {
            type: 'Volo',
            departure: `${outbound.segments[0].departure.iataCode} ${outbound.segments[0].departure.at.split('T')[1].substring(0,5)}`,
            arrival: `${outbound.segments[outbound.segments.length-1].arrival.iataCode} ${outbound.segments[outbound.segments.length-1].arrival.at.split('T')[1].substring(0,5)}`,
            return: `${inbound.segments[0].departure.iataCode} ${inbound.segments[0].departure.at.split('T')[1].substring(0,5)}`,
            returnArrival: `${inbound.segments[inbound.segments.length-1].arrival.iataCode} ${inbound.segments[inbound.segments.length-1].arrival.at.split('T')[1].substring(0,5)}`,
            duration: outbound.duration,
            company: outbound.segments[0].carrierCode
        };
    }

    // Formatta i dati dell'hotel per la visualizzazione  
    formatHotelAccommodation(hotel) {
        if (hotel.name) {
            // Hotel reale da API
            return {
                type: 'Hotel',
                name: hotel.name,
                rating: hotel.rating || 4.0,
                stars: 4,
                reviews: 150,
                amenities: ['WiFi gratuito', 'Colazione inclusa', 'Parcheggio', 'Reception 24h']
            };
        } else {
            // Hotel simulato
            return hotel;
        }
    }

    generateMockHotel() {
        return {
            name: 'Hotel Central',
            rating: 4.2,
            stars: 4,
            reviews: 180,
            amenities: ['WiFi gratuito', 'Colazione inclusa', 'Parcheggio']
        };
    }

    getDestinationName(iataCode) {
        const cityMap = {
            'PAR': 'Parigi',
            'LON': 'Londra', 
            'MAD': 'Madrid',
            'BCN': 'Barcellona',
            'AMS': 'Amsterdam',
            'VIE': 'Vienna',
            'PRG': 'Praga',
            'BUD': 'Budapest'
        };
        return cityMap[iataCode] || iataCode;
    }

    calculateFlightDuration(flight) {
        const departure = new Date(flight.itineraries[0].segments[0].departure.at);
        const arrival = new Date(flight.itineraries[1] ? 
            flight.itineraries[1].segments[flight.itineraries[1].segments.length-1].arrival.at :
            flight.itineraries[0].segments[flight.itineraries[0].segments.length-1].arrival.at
        );
        return Math.ceil((arrival - departure) / (1000 * 60 * 60 * 24));
    }

    // Metodi per integrazione API Amadeus reali
    async getAmadeusToken() {
        const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.apiSecret}`
        });
        
        const data = await response.json();
        this.accessToken = data.access_token;
        return this.accessToken;
    }

    async searchFlights(origin, destination, departureDate, returnDate, adults) {
        if (!this.accessToken) {
            await this.getAmadeusToken();
        }

        const url = `${this.baseUrl}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&max=10`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });

        return await response.json();
    }

    async searchHotels(cityCode, checkIn, checkOut, adults) {
        if (!this.accessToken) {
            await this.getAmadeusToken();
        }

        const url = `${this.baseUrl}/v3/shopping/hotel-offers?hotelIds=MCLONGHM&adults=${adults}&checkInDate=${checkIn}&checkOutDate=${checkOut}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });

        return await response.json();
    }
}

// Inizializza l'applicazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    new TravelPlanner();
});

// Utility functions
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}