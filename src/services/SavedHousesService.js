import { isHouseSaved } from "../utils/validators.js";

export class SavedHousesService {
  constructor(stateManager, storageKey = "userSavedHouses") {
    this.stateManager = stateManager;
    this.storageKey = storageKey;
    this.memoryFallback = [];
  }

  getSavedHouses() {
    return this.stateManager?.get("savedHouses") || [];
  }

  getSavedHouseIds() {
    return this.stateManager?.get("savedHouseIds") || new Set();
  }

  loadSavedHouses() {
    let houses = [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      houses = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(houses)) {
        houses = [];
      }
    } catch (error) {
      console.error("Failed to load saved houses:", error);
      houses = this.memoryFallback;
    }

    const savedHouseIds = new Set(houses.map(house => house.id));
    if (this.stateManager) {
      this.stateManager.batchUpdate({
        savedHouses: houses,
        savedHouseIds
      });
    }

    return houses;
  }

  persistSavedHouses(houses = this.getSavedHouses()) {
    this.memoryFallback = [...houses];
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(houses));
    } catch (error) {
      console.error("Failed to persist saved houses:", error);
    }
  }

  isHouseSaved(home) {
    return isHouseSaved(home, this.getSavedHouseIds());
  }

  toggleSavedHouse(home) {
    const current = this.getSavedHouses();
    const exists = current.some(saved => saved.id === home.id);
    const savedHouses = exists
      ? current.filter(saved => saved.id !== home.id)
      : [...current, home];
    const savedHouseIds = new Set(savedHouses.map(saved => saved.id));

    if (this.stateManager) {
      this.stateManager.batchUpdate({
        savedHouses,
        savedHouseIds
      });
    }

    this.persistSavedHouses(savedHouses);
    return savedHouses;
  }
}

export default SavedHousesService;
