import { calculateDistanceInMiles } from "../utils/calculations.js";


export class HomeService {
  constructor(stateManager) {
    this.stateManager = stateManager;
    
    // Default, check ../DistanceFilter/DistanceFilter.js
    this.maxRadiusMiles = 5; 

    
    if (this.stateManager) {
      this.stateManager.subscribe('searchRadiusUpdate', (newRadius) => {
        this.maxRadiusMiles = newRadius;
        
        
        const currentSelectedSchool = this.stateManager.get("selectedSchool");
        if (currentSelectedSchool) {
          this.getNearbyHomesForSchool(currentSelectedSchool);
        }
      });
    }
  }

  getHomes() {
    return this.stateManager?.get("houses") || [];
  }

 

  applyFilters({ homes = this.getHomes(), minBedrooms = 0, minBathrooms = 0, maxPrice = Number.POSITIVE_INFINITY } = {}) {
    const filtered = homes.filter(home => {
      return (
        Number(home.bedrooms) >= minBedrooms &&
        Number(home.bathrooms) >= minBathrooms &&
        Number(home.price) <= maxPrice
      );
    });

    if (this.stateManager) {
      this.stateManager.set("filteredHomes", filtered);
      this.stateManager.set("activeHomeFilters", { minBedrooms, minBathrooms, maxPrice });
    }

    return filtered;
  }

  getNearbyHomesForSchool(school, homes = this.getHomes(), radiusMiles = this.maxRadiusMiles) {
    if (!school || !Number.isFinite(school.latitude) || !Number.isFinite(school.longitude)) {
      return [];
    }

    return homes
      .filter(home => Number.isFinite(home.latitude) && Number.isFinite(home.longitude))
      .map(home => ({
        ...home,
        distanceToSchool: calculateDistanceInMiles(
          home.latitude,
          home.longitude,
          school.latitude,
          school.longitude
        )
      }))
      .filter(home => home.distanceToSchool <= radiusMiles)
      .sort((a, b) => a.distanceToSchool - b.distanceToSchool);

      
  }


  getNearbyHomesForSchools(schools = [], homes = this.getHomes(), radiusMiles = this.maxRadiusMiles) {
    const nearbyHomesMap = new Map();

    schools.forEach(school => {
      if (!Number.isFinite(school.latitude) || !Number.isFinite(school.longitude)) {
        return;
      }

      homes.forEach(home => {
        if (!Number.isFinite(home.latitude) || !Number.isFinite(home.longitude)) {
          return;
        }

        const distance = calculateDistanceInMiles(
          home.latitude,
          home.longitude,
          school.latitude,
          school.longitude
        );

        if (distance > radiusMiles) {
          return;
        }

        if (!nearbyHomesMap.has(home.id)) {
          nearbyHomesMap.set(home.id, {
            ...home,
            nearbySchools: []
          });
        }

        nearbyHomesMap.get(home.id).nearbySchools.push({
          school: school.name,
          distance
        });
      });
    });

    return Array.from(nearbyHomesMap.values());
  }

  // 
  getNearbySchoolsForHome(home, schools = [], radiusMiles = this.maxRadiusMiles) {
    if (!home || !Number.isFinite(home.latitude) || !Number.isFinite(home.longitude)) {
      return [];
    }

    return schools
      .filter(school => Number.isFinite(school.latitude) && Number.isFinite(school.longitude))
      .map(school => ({
        ...school,
        distance: calculateDistanceInMiles(
          home.latitude,
          home.longitude,
          school.latitude,
          school.longitude
        )
      }))
      .filter(school => school.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance);
  }

  filterNearbySchools(schools, { types = [], levels = [], maxTuition = Number.POSITIVE_INFINITY } = {}) {
    return schools.filter(school => {
      const typeMatch = types.length === 0 || types.some(type => school.type?.includes(type));
      const levelMatch = levels.length === 0 || levels.some(level => school.level?.includes(level));
      const tuitionValue = Number(school.tuition);
      const tuitionMatch = !Number.isFinite(tuitionValue) || tuitionValue <= maxTuition;
      return typeMatch && levelMatch && tuitionMatch;
    });
  }
}

export default HomeService;

