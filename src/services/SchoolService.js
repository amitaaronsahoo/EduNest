import { getSchoolMatchScore } from "../utils/calculations.js";
import { normalizeSearchText } from "../utils/normalizers.js";

export class SchoolService {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getSchools() {
    return this.stateManager?.get("schools") || [];
  }

  applyFilters({ schools = this.getSchools(), types = [], levels = [], maxTuition = Number.POSITIVE_INFINITY } = {}) {
    const filtered = schools.filter(school => {
      const typeMatch = types.length === 0 || types.some(type => school.type?.includes(type));
      const levelMatch = levels.length === 0 || levels.some(level => school.level?.includes(level));
      const tuitionValue = Number(school.tuition);
      const tuitionMatch = !Number.isFinite(tuitionValue) || tuitionValue <= maxTuition;
      return typeMatch && levelMatch && tuitionMatch;
    });

    if (this.stateManager) {
      this.stateManager.set("schoolsFiltered", filtered);
      this.stateManager.set("activeSchoolFilters", { types, levels, maxTuition });
    }

    return filtered;
  }

  searchSchools(query, schools = this.stateManager?.get("schoolsFiltered") || this.getSchools(), limit = 8) {
    const normalized = normalizeSearchText(query);
    if (!normalized) {
      return [...schools].slice(0, limit);
    }

    return schools
      .map(school => ({
        school,
        score: getSchoolMatchScore(school, normalized)
      }))
      .filter(({ score }) => Number.isFinite(score))
      .sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        if (a.school.searchName.length !== b.school.searchName.length) {
          return a.school.searchName.length - b.school.searchName.length;
        }
        return a.school.name.localeCompare(b.school.name);
      })
      .slice(0, limit)
      .map(({ school }) => school);
  }

  findBestSchoolMatch(query, schools = this.getSchools()) {
    if(query == ""){
      return null;
    }else{
    return this.searchSchools(query, schools, 1)[0] || null;
    }
  }

  getSchoolsByIds(ids = [], schools = this.getSchools()) {
    const idSet = new Set(ids.map(Number).filter(Number.isFinite));
    return schools.filter(school => idSet.has(school.id));
  }

  getClosestSchoolsForHome(home, radiusMiles = 5, schools = this.getSchools()) {
    if (!home || !Number.isFinite(home.latitude) || !Number.isFinite(home.longitude)) {
      return [];
    }

    return schools
      .filter(school => Number.isFinite(school.latitude) && Number.isFinite(school.longitude))
      .map(school => ({
        ...school,
        distance: this.calculateDistance(home, school)
      }))
      .filter(school => school.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance);
  }

  calculateDistance(home, school) {
    const lat1 = home.latitude;
    const lon1 = home.longitude;
    const lat2 = school.latitude;
    const lon2 = school.longitude;
    const toRadians = degrees => (degrees * Math.PI) / 180;
    const earthRadiusMiles = 3958.8;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMiles * c;
  }
}

export default SchoolService;
