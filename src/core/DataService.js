import { DATA_PATHS, SCHOOL_ICON_URL, SCHOOL_LEVEL_LABELS } from "../utils/constants.js";
import {
  normalizeSchool,
  parseCoordinate
} from "../utils/normalizers.js";

/**
 * DataService.js
 * Handles all async data loading and normalization.
 * 
 * Responsibilities:
 * - Fetch houses and schools data from JSON files
 * - Normalize and validate data
 * - Populate StateManager with loaded data
 * - Handle errors gracefully
 */

export class DataService {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.dataPaths = { ...DATA_PATHS };
    this.constants = {
      SCHOOL_ICON_URL,
      SCHOOL_LEVEL_LABELS
    };
  }

  /**
   * Load and process all application data
   * @returns {Promise<{ houses: Array, schools: Array }>}
   * @throws {Error} If data loading fails
   */
  async loadAppData() {
    try {
      this.stateManager.set('isLoadingData', true);
      this.stateManager.set('dataLoadError', null);

      const [housesResponse, schoolsResponse] = await Promise.all([
        fetch(this.dataPaths.houses),
        fetch(this.dataPaths.schools)
      ]);

      if (!housesResponse.ok) {
        throw new Error(`Failed to load houses: ${housesResponse.statusText}`);
      }
      if (!schoolsResponse.ok) {
        throw new Error(`Failed to load schools: ${schoolsResponse.statusText}`);
      }

      const housesData = await housesResponse.json();
      const schoolsGeoJson = await schoolsResponse.json();

      // Normalize and validate data
      const normalizedHouses = this.normalizeHouses(housesData);
      const normalizedSchools = this.normalizeSchools(schoolsGeoJson);

      // Update state with loaded data
      this.stateManager.batchUpdate({
        houses: normalizedHouses,
        schools: normalizedSchools,
        filteredHomes: normalizedHouses,
        schoolsFiltered: normalizedSchools
      });

      this.stateManager.set('isLoadingData', false);

      return {
        houses: normalizedHouses,
        schools: normalizedSchools
      };
    } catch (error) {
      console.error('Error loading data:', error);
      this.stateManager.set('dataLoadError', error.message);
      this.stateManager.set('isLoadingData', false);
      throw error;
    }
  }

  /**
   * Normalize houses data from JSON
   * @private
   * @param {Array} housesData - Raw houses array from JSON
   * @returns {Array} Normalized houses
   */
  normalizeHouses(housesData) {
    return housesData.map((house, index) => ({
      id: house.id || index + 1,
      ...house,
      bedrooms: Number(house.bedrooms) || 0,
      bathrooms: Number(house.bathrooms) || 0,
      price: Number(house.price) || 0,
      squareFeet: Number(house.squareFeet) || null,
      longitude: parseCoordinate(house.longitude),
      latitude: parseCoordinate(house.latitude),
      formattedAddress: house.formattedAddress || 'Unknown Address',
      propertyType: house.propertyType || 'N/A'
    }));
  }

  /**
   * Normalize schools data from GeoJSON
   * @private
   * @param {Object} geoJsonData - GeoJSON FeatureCollection
   * @returns {Array} Normalized schools
   */
  normalizeSchools(geoJsonData) {
    const features = geoJsonData.features || [];
    return features
      .map((feature, index) => normalizeSchool(feature, index))
      .filter(school => school !== null); // Remove invalid entries
  }

  /**
   * Get constant value
   * @param {string} key - Constant key
   * @returns {*}
   */
  getConstant(key) {
    return this.constants[key];
  }

  /**
   * Get all constants
   * @returns {Object}
   */
  getConstants() {
    return { ...this.constants };
  }

  /**
   * Override data paths (useful for testing)
   * @param {Object} newPaths - { houses: string, schools: string }
   */
  setDataPaths(newPaths) {
    this.dataPaths = { ...this.dataPaths, ...newPaths };
  }
}

export default DataService;
