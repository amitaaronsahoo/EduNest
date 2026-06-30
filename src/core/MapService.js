/**
 * MapService.js
 * Manages Leaflet map lifecycle: initialization, rendering, destruction.
 * 
 * Features:
 * - Explicit map destruction to prevent "already initialized" errors
 * - Marker layer management
 * - Dynamic bounds fitting
 * - Lifecycle hooks for mount/update/destroy
 * 
 * Critical Constraint: Always call map.remove() before re-initializing!
 */

export class MapService {
  constructor(stateManager = null) {
    this.stateManager = stateManager;
    this.map = null;
    this.markersLayer = null;
    this.detailMap = null;
    this.detailMarkersLayer = null;
    this.mapContainer = null;
    this.detailMapContainer = null;
    this.defaultCenter = [38.2, -85.8]; // Louisville, KY
    this.defaultZoom = 11;
  }

  /**
   * Initialize main map instance
   * @param {string} containerId - ID of HTML container element
   * @returns {L.Map} Leaflet map instance
   * @throws {Error} If container not found or map creation fails
   */
  initializeMap(containerId = 'map') {
    if (this.map) {
      this.destroyMap();
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Map container with ID "${containerId}" not found`);
    }

    this.mapContainer = container;

    try {
      this.map = L.map(container, { zoomControl: true, scrollWheelZoom: true }).setView(this.defaultCenter, this.defaultZoom);
      L.tileLayer(
"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
{
    attribution:"©OpenStreetMap ©CARTO",
    maxZoom:20
}).addTo(this.map);

      // Create markers layer group
      this.markersLayer = L.layerGroup().addTo(this.map);

      if (this.stateManager) {
        this.stateManager.set('mapReady', true);
      }

      return this.map;
    } catch (error) {
      console.error('Failed to initialize map:', error);
      throw error;
    }
  }

  /**
   * Initialize detail map instance (for house detail view)
   * @param {string} containerId - ID of HTML container element
   * @returns {L.Map} Leaflet map instance
   */
  initializeDetailMap(containerId = 'detailMap') {
    // Clean up existing map if present
    if (this.detailMap) {
      this.destroyDetailMap();
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Detail map container with ID "${containerId}" not found`);
    }

    this.detailMapContainer = container;

    try {
      this.detailMap = L.map(container, { zoomControl: true, scrollWheelZoom: true }).setView(this.defaultCenter, this.defaultZoom);

      L.tileLayer(
"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
{
    attribution:"©OpenStreetMap ©CARTO",
    maxZoom:20
}).addTo(this.detailMap);

      this.detailMarkersLayer = L.layerGroup().addTo(this.detailMap);

      if (this.stateManager) {
        this.stateManager.set('detailMapReady', true);
      }

      return this.detailMap;
    } catch (error) {
      console.error('Failed to initialize detail map:', error);
      throw error;
    }
  }

  /**
   * Add school markers to the selected map view.
   * @param {Array<Object>} items - Array of school objects
   * @param {Function} onMarkerClick - Callback when marker is clicked
   * @param {Object} options - { mapType, clearExisting, popupText, popupOptions, title, icon, onPopupOpen }
   * @returns {L.LatLngBounds|null} Bounds of all markers
   */
  addSchoolMarkers(items, onMarkerClick = null, options = {}) {
    return this.addMarkersToMap(items, {
      ...options,
      mapType: options.mapType || 'main',
      icon: options.icon || this.createSchoolMarkerIcon(),
      popupText: options.popupText || (item => {
        const details = [];
        if (item.name) details.push(`<strong>${item.name}</strong>`);
        if (item.level) details.push(item.level);
        if (item.type) details.push(item.type);
        if (item.formattedAddress) details.push(item.formattedAddress);
        return details.length ? `<div style="min-width:220px">${details.map(line => `<div>${line}</div>`).join('')}</div>` : null;
      })
    }, onMarkerClick);
  }

  /**
   * Add home markers to the selected map view.
   * @param {Array<Object>} items - Array of home objects
   * @param {Function} onMarkerClick - Callback when marker is clicked
   * @param {Object} options - { mapType, clearExisting, popupText, popupOptions, title, icon, onPopupOpen }
   * @returns {L.LatLngBounds|null} Bounds of all markers
   */
  addHomeMarkers(items, onMarkerClick = null, options = {}) {
    return this.addMarkersToMap(items, {
      ...options,
      mapType: options.mapType || 'main',
      icon: options.icon || this.createHomeMarkerIcon(),
      popupText: options.popupText || (item => {
        const address = item.formattedAddress || item.address || 'Property';
        return `<div style="min-width:220px"><strong>${address}</strong></div>`;
      })
    }, onMarkerClick);
  }

  addMarkersToMap(items, options = {}, onMarkerClick = null) {
    const markerItems = Array.isArray(items) ? items : [items];
    const mapType = options.mapType || 'main';
    const targetMap = mapType === 'detail' ? this.detailMap : this.map;
    const targetLayer = mapType === 'detail' ? this.detailMarkersLayer : this.markersLayer;

    if (!targetMap || !targetLayer) {
      console.warn(`Map not initialized for ${mapType} view. Cannot add markers.`);
      return null;
    }

    if (options.clearExisting !== false) {
      targetLayer.clearLayers();
    }

    const bounds = [];

    markerItems.forEach(item => {
      if (!item || !this.isValidCoordinate(item.latitude, item.longitude)) {
        return;
      }

      const latLng = [item.latitude, item.longitude];
      bounds.push(latLng);

      const marker = L.marker(latLng, {
        title: options.title ? options.title(item) : (item.formattedAddress || item.name || 'Marker'),
        icon: options.icon || this.createHomeMarkerIcon()
      });

      const popupContent = typeof options.popupText === 'function' ? options.popupText(item) : options.popupText;
      if (popupContent) {
        marker.bindPopup(popupContent, options.popupOptions || {});
      }

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(item));
      }

      if (options.onPopupOpen) {
        marker.on('popupopen', event => options.onPopupOpen(marker, item, event));
      }

      marker.addTo(targetLayer);
    });

    const boundsInstance = bounds.length > 0 ? L.latLngBounds(bounds) : null;
    if (boundsInstance) {
      if (mapType === 'detail') {
        this.detailMap.fitBounds(boundsInstance, { padding: [50, 50] });
      } else {
        this.map.fitBounds(boundsInstance, { padding: [50, 50] });
      }
    } else if (mapType === 'detail') {
      this.detailMap.setView(this.defaultCenter, this.defaultZoom);
    } else {
      this.map.setView(this.defaultCenter, this.defaultZoom);
    }

    if (mapType === 'detail') {
      this.invalidateDetailMapSize();
    } else {
      this.invalidateMapSize();
    }

    return boundsInstance;
  }

  addMarkers(items, onMarkerClick = null, options = {}) {
    return this.addHomeMarkers(items, onMarkerClick, options);
  }

  addDetailMarkers(centerItem, nearbyItems = [], onMarkerClick = null) {
    if (!centerItem) {
      return null;
    }

    this.addHomeMarkers([centerItem], onMarkerClick, {
      mapType: 'detail',
      clearExisting: true,
      popupText: item => `<strong>${item.formattedAddress || item.name || 'Property'}</strong>`
    });

    return this.addSchoolMarkers(nearbyItems || [], onMarkerClick, {
      mapType: 'detail',
      clearExisting: false,
      popupText: item => item.name ? `<strong>${item.name}</strong><br>${item.formattedAddress || ''}` : null
    });
  }

  createSchoolMarkerIcon() {
    return L.icon({
      iconUrl: "https://cdn2.iconfinder.com/data/icons/school-pack-2/512/1-1024.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  createHomeMarkerIcon() {
    return L.icon({
      iconUrl: "https://cdn.pixabay.com/photo/2015/12/28/02/58/home-1110868_1280.png",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  }

  /**
   * Destroy main map instance
   * CRITICAL: Prevents "Map container is already initialized" errors
   */
  destroyMap() {
    if (!this.map) return;

    try {
      // Clear markers first
      if (this.markersLayer) {
        this.markersLayer.clearLayers();
      }

      // Remove all layers
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.LayerGroup) {
          this.map.removeLayer(layer);
        }
      });

      // Destroy the map instance
      this.map.remove();
      this.map = null;
      this.markersLayer = null;

      if (this.stateManager) {
        this.stateManager.set('mapReady', false);
      }
    } catch (error) {
      console.error('Error destroying map:', error);
    }
  }

  /**
   * Destroy detail map instance
   */
  destroyDetailMap() {
    if (!this.detailMap) return;

    try {
      if (this.detailMarkersLayer) {
        this.detailMarkersLayer.clearLayers();
      }

      this.detailMap.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.LayerGroup) {
          this.detailMap.removeLayer(layer);
        }
      });

      this.detailMap.remove();
      this.detailMap = null;
      this.detailMarkersLayer = null;

      if (this.stateManager) {
        this.stateManager.set('detailMapReady', false);
      }
    } catch (error) {
      console.error('Error destroying detail map:', error);
    }
  }

  /**
   * Invalidate map size (needed after DOM changes)
   */
  invalidateMapSize() {
    if (this.map) {
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 100);
    }
  }

  /**
   * Invalidate detail map size
   */
  invalidateDetailMapSize() {
    if (this.detailMap) {
      setTimeout(() => {
        this.detailMap?.invalidateSize();
      }, 100);
    }
  }

  /**
   * Validate coordinate values
   * @private
   * @param {number} latitude
   * @param {number} longitude
   * @returns {boolean}
   */
  isValidCoordinate(latitude, longitude) {
    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude !== 0 &&
      longitude !== 0 &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  /**
   * Get current main map instance
   * @returns {L.Map|null}
   */
  getMap() {
    return this.map;
  }

  /**
   * Get current detail map instance
   * @returns {L.Map|null}
   */
  getDetailMap() {
    return this.detailMap;
  }

  /**
   * Check if main map is initialized
   * @returns {boolean}
   */
  isMapReady() {
    return this.map !== null;
  }

  /**
   * Check if detail map is initialized
   * @returns {boolean}
   */
  isDetailMapReady() {
    return this.detailMap !== null;
  }

  /**
   * Clean up all resources
   */
  destroy() {
    this.destroyMap();
    this.destroyDetailMap();
    this.mapContainer = null;
    this.detailMapContainer = null;
  }
}

export default MapService;
