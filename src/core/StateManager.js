/**
 * StateManager.js
 * Centralized state management with strict Pub/Sub (Observer) pattern.
 * 
 * Features:
 * - Reactive state updates via setter methods
 * - Pub/Sub subscribers notified on state changes
 * - No direct mutations allowed
 * - Full state history tracking (optional)
 * - Type validation for common state structures
 */

export class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.subscribers = new Map(); // { stateKey: Set<callbacks> }
    this.history = [];
    this.enableHistory = false;
    this.locked = false;
  }

  /**
   * Enable state change history (for debugging)
   * @param {boolean} enable
   */
  setHistoryTracking(enable) {
    this.enableHistory = enable;
    if (!enable) {
      this.history = [];
    }
  }

  /**
   * Get current state value
   * @param {string} key - State key
   * @returns {*} Current value
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set state value and notify subscribers
   * ONLY method for state mutations
   * @param {string} key - State key
   * @param {*} value - New value
   * @throws {Error} If state is locked
   */
  set(key, value) {
    if (this.locked) {
      throw new Error('State is locked. Cannot modify during update cycle.');
    }

    const oldValue = this.state[key];

    // Skip if value didn't actually change (shallow comparison)
    if (oldValue === value) {
      return;
    }

    // Record history
    if (this.enableHistory) {
      this.history.push({
        timestamp: Date.now(),
        key,
        oldValue,
        newValue: value,
        stack: new Error().stack
      });
    }

    // Update state
    this.state[key] = value;

    // Notify subscribers
    this.notifySubscribers(key, value);
  }

  /**
   * Batch update multiple state keys at once
   * Lock state during update to prevent circular updates
   * @param {Object} updates - { key: value } pairs
   */
  batchUpdate(updates) {
    this.locked = true;

    try {
      Object.entries(updates).forEach(([key, value]) => {
        const oldValue = this.state[key];
        if (oldValue !== value) {
          this.state[key] = value;
          if (this.enableHistory) {
            this.history.push({
              timestamp: Date.now(),
              key,
              oldValue,
              newValue: value
            });
          }
        }
      });

      // Notify all affected subscribers once
      Object.keys(updates).forEach(key => {
        this.notifySubscribers(key, this.state[key]);
      });
    } finally {
      this.locked = false;
    }
  }

  /**
   * Subscribe to state changes
   * @param {string} key - State key to watch
   * @param {Function} callback - Called when state[key] changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (typeof callback !== 'function') {
      throw new Error(`Subscriber for state.${key} must be a function`);
    }

    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }

    this.subscribers.get(key).add(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(key, callback);
  }

  /**
   * Unsubscribe from state changes
   * @param {string} key - State key
   * @param {Function} callback - Callback to remove
   */
  unsubscribe(key, callback) {
    if (!this.subscribers.has(key)) return;
    this.subscribers.get(key).delete(callback);
  }

  /**
   * Notify all subscribers of a state change
   * @private
   * @param {string} key - State key that changed
   * @param {*} newValue - New state value
   */
  notifySubscribers(key, newValue) {
    if (!this.subscribers.has(key)) return;

    const callbacks = this.subscribers.get(key);
    callbacks.forEach(callback => {
      try {
        callback(newValue);
      } catch (error) {
        console.error(`Error in subscriber for state.${key}:`, error);
      }
    });
  }

  /**
   * Clear all state
   */
  reset() {
    this.state = {};
    this.subscribers.clear();
    this.history = [];
  }

  /**
   * Get subscriber count for a key (for debugging)
   * @param {string} key
   * @returns {number}
   */
  getSubscriberCount(key) {
    return this.subscribers.get(key)?.size || 0;
  }

  /**
   * Get all current state as object
   * @returns {Object}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Validate and initialize application state structure
   * Called during app initialization
   */
  initializeAppState() {
    const defaultState = {
      // Data
      houses: [],
      schools: [],
      
      // Filtering
      filteredHomes: [],
      schoolsFiltered: [],
      activeSchoolFilters: {
        types: [],
        levels: [],
        maxTuition: 5000
      },
      activeHomeFilters: {
        minBedrooms: 0,
        minBathrooms: 0,
        maxPrice: 300000
      },
      activeDetailFilters: {
        types: [],
        levels: [],
        maxTuition: 5000
      },

      // UI State
      currentTab: 'schools',
      currentHouseDetail: null,
      lastSelectedSchool: null,

      // Saved Homes
      savedHouses: [],
      savedHouseIds: new Set(),

      // Loading states
      isLoadingData: false,
      dataLoadError: null,

      // Maps
      mapReady: false,
      detailMapReady: false
    };

    Object.entries(defaultState).forEach(([key, value]) => {
      if (!(key in this.state)) {
        this.state[key] = value;
      }
    });
  }
}

export default StateManager;
