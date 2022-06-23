import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider, GoogleProvider } from 'leaflet-geosearch';
import { GestureHandling } from "leaflet-gesture-handling";

export default class MapManager {
  constructor() {
    const mapDomEl = document.getElementById('map');
    const lat = mapDomEl.dataset.lat
    const lng = mapDomEl.dataset.lng
    if (lat && lng) {
      this.simpleMode(lat, lng)
    } else {
      this.fullMode();
    }
  }

  // `show` view
  simpleMode(lat, lng){
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

    this.map = L.map('map', { gestureHandling: true }).setView([lat, lng], 18);
    this.map.attributionControl.setPrefix(document.getElementById('map').dataset.brand);
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 18,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);


    const marker = document.getElementById('map').dataset.marker;
    this.markerGroup = L.layerGroup().addTo(this.map);

    if (marker === 'exact') {
      const address = document.getElementById('map').dataset.address;

      L.marker([lat, lng]).addTo(this.markerGroup).bindPopup(address).openPopup();

      this.closePopupButton.addEventListener('click', (e) => {
        e.preventDefault();
      });
    } else if (marker === 'circle'){
      L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
      }).addTo(this.markerGroup);
    }
  }

  // `add/edit` view
  fullMode() {
    this.map = L.map('map').setView(this.fetchCoords(), this.hasInitialCoords() ? 18 : 14);
    this.map.attributionControl.setPrefix(document.getElementById('map').dataset.brand);
    this.markerGroup = L.layerGroup().addTo(this.map);

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 18,
      subdomains: ['mt0','mt1','mt2','mt3']
    }).addTo(this.map);

    this.setLocale();

    // Providers setup
    // ---
    const developmentProvider = new OpenStreetMapProvider({
      params: this.setupOpenStreetMapParams()
    })

    const productionProvider = new GoogleProvider({
      params: this.setupGoogleParams()
    });
    // --------

    // This is the searchbox
    const searchControl = new GeoSearchControl({
      provider: this.environment === 'development' ? developmentProvider : productionProvider,
      style: 'bar',
      searchLabel: document.getElementById('map').dataset.searchPrompt,
      autoClose: true,
      keepResult: true
    });

    this.map.addControl(searchControl);

    this.setInitialCoords()

    this.setListeners();

    // We need this in order to access the map from within the stepper class because tabs
    window.$map = this.map;
  }

  setLagLng(latlng) {
    this.latField.value = latlng.lat;
    this.lngField.value = latlng.lng;
  }

  setListeners() {
    // When an address is typed, the map shows a marker and a new location.
    // We use this to set the address field value and clear any manually placed markers
    this.map.on('geosearch/showlocation', e => {
      this.markerGroup.clearLayers();
      this.addressField.value = this.environment === 'development' ? this.formatGRAddress(e.location.label) : e.location.label;
      this.setLagLng({ lat: e.location.y, lng: e.location.x });
      
      this.dispatchEvent(true);
    });

    // When the `x` button is pressed on the search bar, we remove all existing markers,
    // and clear the address search bar
    this.resetButton.addEventListener('click', () => {
      this.addressField.value = null;
      this.setLagLng({ lat: null, lng: null });
      this.markerGroup.clearLayers();

      this.dispatchEvent(false);
    });

    // We use this when selecting a custom location on the map (marker).
    this.map.on('click', (e) => {
      this.resetButton.click();

      if (this.environment === 'development'){
        fetch(`https://nominatim.openstreetmap.org/reverse?&accept-language=${this.active_locale}&format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
            .then(response => response.json())
            .then(data => {
              this.geoSearchInput.value = data.display_name;
              this.addressField.value = this.formatGRAddress(data.display_name);
              this.setLagLng(e.latlng);
            });
      } else {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latlng.lat},${e.latlng.lng}&key=${this.googleAPIKey}&language=${this.activeLanguage}`)
            .then(response => response.json())
            .then(data => {
              this.geoSearchInput.value = data.results[0]?.formatted_address;
              this.addressField.value = data.results[0]?.formatted_address;
              this.setLagLng(e.latlng);
            });
      }

      this.markerGroup.clearLayers();
      L.marker(e.latlng).addTo(this.markerGroup);

      this.dispatchEvent(true);
    });
  }

  dispatchEvent(detail) {
    window.dispatchEvent(new CustomEvent('mapChange', { detail: detail }));
  }

  setLocale() {
    let active_locale = document.getElementById('current_locale').dataset.i18n;
    active_locale = JSON.parse(active_locale);

    active_locale = active_locale['locale'] || 'en';
    this.active_locale = active_locale === 'el' ? 'gr' : active_locale
  }

  formatGRAddress(addressString) {
    if (addressString) {
      const tokenizedResultLabel = addressString.split(',');
      if (tokenizedResultLabel.length < 1) return addressString;

      // DEBUG
      // console.log(tokenizedResultLabel);

      let address = parseInt(tokenizedResultLabel[0]);

      let city = tokenizedResultLabel.slice(-7, -6).map(token => token.trim())[0];
      let postcode = tokenizedResultLabel.slice(-2,-1).map(token => token.trim())[0];

      if (isNaN(address)){
        address = tokenizedResultLabel[0];
      } else {
        address = tokenizedResultLabel.slice(0, 2).reverse().map(token => token.trim()).join(' ');
      }

      // const location = tokenizedResultLabel.slice(-3).map(token => token.trim()).join(', ');

      // DEBUG
      // console.log(`${address}, ${city}, ${postcode}`);
      return `${address}, ${city}, ${postcode}`;
    } else {
      return addressString;
    }
  }

  fetchCoords() {
    if (this.latField.value && this.lngField.value) {
      return [this.latField.value, this.lngField.value]
    }
    return [37.9719, 23.7341]
  }

  hasInitialCoords(){
    return !!(this.latField.value || this.lngField.value || this.addressField.value);
  }

  setInitialCoords(){
    if (!this.latField.value || !this.lngField.value || !this.addressField.value) return;

    L.marker([this.latField.value, this.lngField.value]).addTo(this.markerGroup);
    this.geoSearchInput.value = this.addressField.value;
  }

  get addressField() {
    return document.querySelector('[name="property[address]"]');
  }

  get resetButton() {
    return document.querySelector('.leaflet-control-geosearch.leaflet-geosearch-bar a.reset');
  }

  get closePopupButton() {
    return document.querySelector('.leaflet-popup a.leaflet-popup-close-button');
  }

  get latField() {
    return document.querySelector('[name="property[lat]"]');
  }

  get lngField() {
    return document.querySelector('[name="property[lng]"]');
  }

  get form() {
    return document.querySelector('form');
  }

  get geoSearchInput() {
    return document.querySelector('.leaflet-control-geosearch.leaflet-geosearch-bar input');
  }

  get environment(){
    return document.getElementById('map').dataset.environment
  }

  get accountFlavor(){
    return document.getElementById('map').dataset.accountFlavor
  }

  get googleAPIKey(){
    return 'AIzaSyBRJALSKJdl_WsxNHhmvL4X404bcZxredE';
  }

  get activeLanguage() {
    return this.active_locale === 'gr' ? 'el' : 'en';
  }

  setupOpenStreetMapParams() {
    const base = {
      'accept-language': this.activeLanguage
    };
    return Object.assign({}, base, this.accountFlavor === 'greek' ? { countrycodes: 'gr' } : null);
  }

  setupGoogleParams(){
    const base = {
      key: this.googleAPIKey,
      language: this.activeLanguage
    }
    return Object.assign({}, base, this.accountFlavor === 'greek' ? { region: 'gr' } : null);
  }
}
