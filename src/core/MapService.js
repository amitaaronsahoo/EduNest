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
    // Clean up existing map if present
    if (this.map) {
      this.destroyMap();
    }

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Map container with ID "${containerId}" not found`);
    }

    this.mapContainer = container;

    try {
      // Initialize Leaflet map
      this.map = L.map(container).setView(this.defaultCenter, this.defaultZoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19
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
      this.detailMap = L.map(container).setView(this.defaultCenter, this.defaultZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19
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
   * Add markers to main map
   * @param {Array<Object>} items - Array of { id, latitude, longitude, ...props }
   * @param {Function} onMarkerClick - Callback when marker is clicked
   * @param {Object} options - { icon, popupText }
   * @returns {L.LatLngBounds|null} Bounds of all markers
   */
  addMarkers(items, onMarkerClick = null, options = {}) {
    if (!this.map || !this.markersLayer) {
      console.warn('Map not initialized. Cannot add markers.');
      return null;
    }

    this.markersLayer.clearLayers();
    const bounds = [];

    items.forEach(item => {
      if (!this.isValidCoordinate(item.latitude, item.longitude)) {
        return; // Skip invalid items
      }

      const latLng = [item.latitude, item.longitude];
      bounds.push(latLng);

      const marker = L.marker(latLng, {
        icon: options.icon || L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      });

      if (options.popupText) {
        marker.bindPopup(options.popupText(item));
      }

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(item));
      }

      marker.addTo(this.markersLayer);
    });

    // Fit map to bounds
    if (bounds.length > 0) {
      const latLngBounds = L.latLngBounds(bounds);
      this.map.fitBounds(latLngBounds, { padding: [50, 50] });
    }

    // Invalidate size after bounds change
    this.invalidateMapSize();

    return bounds.length > 0 ? L.latLngBounds(bounds) : null;
  }

  /**
   * Add markers to detail map
   * @param {Object} centerItem - Central item (house) with lat/lon
   * @param {Array<Object>} nearbyItems - Array of nearby items (schools) with lat/lon
   * @param {Function} onMarkerClick - Callback when marker is clicked
   * @returns {L.LatLngBounds|null} Bounds of all markers
   */
  addDetailMarkers(centerItem, nearbyItems = [], onMarkerClick = null) {
    if (!this.detailMap || !this.detailMarkersLayer) {
      console.warn('Detail map not initialized. Cannot add markers.');
      return null;
    }

    this.detailMarkersLayer.clearLayers();
    const bounds = [];

    // Add center marker (house)
    if (this.isValidCoordinate(centerItem.latitude, centerItem.longitude)) {
      const centerLatLng = [centerItem.latitude, centerItem.longitude];
      bounds.push(centerLatLng);

      const centerMarker = L.marker(centerLatLng, {
        icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      });

      centerMarker.bindPopup(`<strong>${centerItem.formattedAddress}</strong>`);
      centerMarker.addTo(this.detailMarkersLayer);
    }

    // Add nearby markers (schools)
    nearbyItems.forEach(item => {
      if (!this.isValidCoordinate(item.latitude, item.longitude)) {
        return;
      }

      const latLng = [item.latitude, item.longitude];
      bounds.push(latLng);

      const schoolMarker = L.marker(latLng, {
        icon: L.icon({
          iconUrl: 'https://cdn2.iconfinder.com/data/icons/school-pack-2/512/1-1024.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      });

      if (item.name) {
        schoolMarker.bindPopup(`<strong>${item.name}</strong><br>${item.formattedAddress || ''}`);
      }

      if (onMarkerClick) {
        schoolMarker.on('click', () => onMarkerClick(item));
      }

      schoolMarker.addTo(this.detailMarkersLayer);
    });

    // Fit map to bounds
    if (bounds.length > 0) {
      const latLngBounds = L.latLngBounds(bounds);
      this.detailMap.fitBounds(latLngBounds, { padding: [50, 50] });
    }

    this.invalidateDetailMapSize();

    return bounds.length > 0 ? L.latLngBounds(bounds) : null;
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
