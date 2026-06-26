# EduNest Refactoring: Procedural → Component-Based Architecture

## Problem Statement
The EduNest project currently has a flat, procedural structure with 54 standalone JavaScript files in `/js` and a monolithic `styles.css`. This creates:
- **No code organization** — Functions scattered across many files
- **Unclear dependencies** — Global state and function calls are implicit
- **Poor maintainability** — No component encapsulation
- **Difficult scaling** — Hard to add features without modifying multiple unrelated files

## Solution Approach
Refactor to a **strict hierarchical, component-based architecture** using:
- **ES6 Classes** for component logic and services
- **ES Modules** for dependency management
- **Separation of Concerns** — Components, Services, Utils, and Styles colocated
- **Vite** as the module bundler and dev server

## Complete Refactored `/src` Directory Structure

```
/src
  │
  ├── core/
  │   ├── UIComponent.js          [Base class for all UI components - DOM manipulation, event handling]
  │   ├── MapService.js           [Base class for map services - Leaflet initialization, marker management]
  │   ├── DataService.js          [Service for loading and managing global data (houses, schools)]
  │   └── StateManager.js         [Centralized state object - replaces global `state` variable]
  │
  ├── services/
  │   ├── SchoolService.js        [Business logic: School data normalization, filtering, searching]
  │   │   └── Extracted from:
  │   │       - normalizeSchool.js
  │   │       - normalizeSchoolLevel.js
  │   │       - normalizeSchoolType.js
  │   │       - normalizeOptionalText.js
  │   │       - normalizeSearchText.js
  │   │       - formatSchoolAddress.js
  │   │       - getSchoolMatchScore.js
  │   │       - applySchoolFilters.js
  │   │       - getCheckedSchoolIds.js
  │   │       - getCheckedSchools.js
  │   │
  │   ├── HomeService.js          [Business logic: Home data processing, filtering, distance calculations]
  │   │   └── Extracted from:
  │   │       - parseCoordinate.js
  │   │       - hasCoordinates.js
  │   │       - calculateDistanceInMiles.js
  │   │       - filterHouseSchools.js
  │   │       - applyHomeFilters.js
  │   │       - getHouseDetailSchoolFilters.js
  │   │
  │   ├── SavedHousesService.js   [Business logic: Save/load saved homes, persistence]
  │   │   └── Extracted from:
  │   │       - isHouseSaved.js
  │   │       - toggleSavedHouse.js
  │   │       - persistSavedHouses.js
  │   │       - loadSavedHouses.js
  │   │       - updateSaveButtons.js
  │   │
  │   └── MapService.js           [Business logic: Map initialization, rendering, marker management]
  │       └── Extracted from:
  │           - initializeMap.js
  │           - initializeDetailMap.js
  │           - renderMapForSchool.js
  │           - renderHouseDetailMap.js
  │           - searchHomesNearSchool.js
  │           - searchHomesForAllSelectedSchools.js
  │
  ├── components/
  │   │
  │   ├── SchoolDirectory/
  │   │   ├── SchoolDirectory.js            [Main school directory component]
  │   │   ├── SchoolDirectory.css
  │   │   │   └── Extracted from: styles.css (school-related styles)
  │   │   │
  │   │   ├── SchoolRow/
  │   │   │   ├── SchoolRow.js             [Individual school row in table]
  │   │   │   └── SchoolRow.css            [Row styling]
  │   │   │   └── Extracted from:
  │   │   │       - renderSchoolsList.js
  │   │   │
  │   │   └── SchoolFilter/
  │   │       ├── SchoolFilter.js          [School filtering panel (tuition, type, level)]
  │   │       ├── SchoolFilter.css
  │   │       └── Extracted from:
  │   │           - applySchoolFilters.js
  │   │           - HTML filter inputs from index.html
  │   │
  │   ├── HomeCard/
  │   │   ├── HomeCard.js                   [Individual home card component]
  │   │   ├── HomeCard.css                  [Card styling]
  │   │   └── Extracted from:
  │   │       - createHomeCard.js
  │   │
  │   ├── HomesList/
  │   │   ├── HomesList.js                  [Container for home cards grid]
  │   │   ├── HomesList.css                 [Grid and list styling]
  │   │   │
  │   │   ├── HomeFilter/
  │   │   │   ├── HomeFilter.js             [Filter panel (bedrooms, bathrooms, price)]
  │   │   │   ├── HomeFilter.css
  │   │   │   └── Extracted from:
  │   │   │       - applyHomeFilters.js
  │   │   │       - HTML filter inputs from index.html
  │   │   │
  │   │   └── HomeMap/
  │   │       ├── HomeMap.js                [Map container for homes]
  │   │       ├── HomeMap.css               [Map styling]
  │   │       └── Extracted from:
  │   │           - renderHomes.js
  │   │           - initializeMap.js
  │   │
  │   ├── HouseDetail/
  │   │   ├── HouseDetail.js                [Main house detail view container]
  │   │   ├── HouseDetail.css
  │   │   │
  │   │   ├── HouseDetailInfo/
  │   │   │   ├── HouseDetailInfo.js        [Property details display]
  │   │   │   ├── HouseDetailInfo.css
  │   │   │   └── Extracted from:
  │   │   │       - renderHouseDetailView.js
  │   │   │       - generateZillowUrl.js
  │   │   │
  │   │   ├── HouseDetailMap/
  │   │   │   ├── HouseDetailMap.js         [Map for house detail view]
  │   │   │   ├── HouseDetailMap.css
  │   │   │   └── Extracted from:
  │   │   │       - renderHouseDetailMap.js
  │   │   │       - initializeDetailMap.js
  │   │   │
  │   │   ├── SchoolFilterDetail/
  │   │   │   ├── SchoolFilterDetail.js     [School filter for house detail]
  │   │   │   ├── SchoolFilterDetail.css
  │   │   │   └── Extracted from:
  │   │   │       - applyHouseDetailFilters.js
  │   │   │       - getHouseDetailSchoolFilters.js
  │   │   │
  │   │   └── NearbySchoolsList/
  │   │       ├── NearbySchoolsList.js      [List of nearby schools for house detail]
  │   │       ├── NearbySchoolsList.css
  │   │       └── Extracted from:
  │   │           - renderHouseNearbySchoolsList.js
  │   │           - filterHouseSchools.js
  │   │
  │   ├── SavedHomes/
  │   │   ├── SavedHomes.js                 [Main saved homes container]
  │   │   ├── SavedHomes.css
  │   │   │
  │   │   ├── SavedHomesSidebar/
  │   │   │   ├── SavedHomesSidebar.js      [Sidebar list of saved homes]
  │   │   │   ├── SavedHomesSidebar.css
  │   │   │   └── Extracted from:
  │   │   │       - renderSavedHouses.js
  │   │   │
  │   │   └── SavedHomesGrid/
  │   │       ├── SavedHomesGrid.js         [Grid display of saved homes]
  │   │       ├── SavedHomesGrid.css
  │   │       └── Extracted from:
  │   │           - renderSavedHouses.js
  │   │
  │   ├── SchoolSearch/
  │   │   ├── SchoolSearch.js               [School search input with suggestions]
  │   │   ├── SchoolSearch.css
  │   │   │
  │   │   └── SchoolSuggestions/
  │   │       ├── SchoolSuggestions.js      [Dropdown suggestions for school search]
  │   │       ├── SchoolSuggestions.css
  │   │       └── Extracted from:
  │   │           - showSchoolSuggestions.js
  │   │           - clearSchoolSuggestions.js
  │   │           - moveSuggestionSelection.js
  │   │           - selectActiveSuggestion.js
  │   │           - ensureSchoolSuggestionsContainer.js
  │   │
  │   ├── SchoolSearchHome/
  │   │   ├── SchoolSearchHome.js           [School search for homes tab]
  │   │   ├── SchoolSearchHome.css
  │   │   └── Extracted from:
  │   │       - searchHomesNearSchool.js
  │   │       - searchHomesForAllSelectedSchools.js
  │   │
  │   ├── Navigation/
  │   │   ├── Navigation.js                 [Tab navigation component]
  │   │   ├── Navigation.css
  │   │   └── Extracted from:
  │   │       - switchTab.js
  │   │       - HTML tab buttons from index.html
  │   │
  │   └── AppShell/
  │       ├── AppShell.js                   [Main app container and layout manager]
  │       ├── AppShell.css                  [Layout styling]
  │       └── Extracted from:
  │           - returnFromDetail.js
  │           - app.js initialization logic
  │
  ├── utils/
  │   ├── formatters.js           [Pure functions: currency(), formatSchoolAddress()]
  │   │   └── Extracted from:
  │   │       - currency.js
  │   │       - formatSchoolAddress.js
  │   │
  │   ├── validators.js           [Pure functions: hasCoordinates(), isHouseSaved()]
  │   │   └── Extracted from:
  │   │       - hasCoordinates.js
  │   │       - isHouseSaved.js
  │   │
  │   ├── calculations.js         [Pure functions: calculateDistanceInMiles(), getSchoolMatchScore()]
  │   │   └── Extracted from:
  │   │       - calculateDistanceInMiles.js
  │   │       - getSchoolMatchScore.js
  │   │
  │   ├── normalizers.js          [Pure functions for normalizing text, coordinates, school data]
  │   │   └── Extracted from:
  │   │       - normalizeText.js
  │   │       - normalizeSearchText.js
  │   │       - normalizeOptionalText.js
  │   │       - normalizeSchoolLevel.js
  │   │       - normalizeSchoolType.js
  │   │       - parseCoordinate.js
  │   │
  │   └── constants.js            [Global constants and config]
  │       └── Extracted from:
  │           - DATA_PATHS, SCHOOL_ICON_URL, SCHOOL_LEVEL_LABELS from app.js
  │
  ├── styles/
  │   ├── main.css                [Global styles - refactored from monolithic styles.css]
  │   ├── components.css          [Shared component styles]
  │   ├── layout.css              [Layout and grid styles]
  │   ├── colors.css              [Color palette and theme]
  │   └── typography.css          [Font and text styles]
  │
  └── main.js                     [Vite entry point (replaces app.js)]
      └── Entry point that:
          - Initializes AppShell
          - Loads data via DataService
          - Mounts all components
          - Binds global event listeners

```

## Mapping Summary: 54 Files → Organized Component Architecture

### **Current Files Mapping:**

**App Entry Point (1 file):**
- `app.js` → `main.js` + `core/StateManager.js` + `components/AppShell.js`

**Core/Base Classes (4 files):**
- NEW: `core/UIComponent.js`, `core/MapService.js`, `core/DataService.js`, `core/StateManager.js`

**Services (4 files):**
- `SchoolService.js`: normalizeSchool, normalizeSchoolLevel, normalizeSchoolType, normalizeOptionalText, normalizeSearchText, formatSchoolAddress, getSchoolMatchScore, applySchoolFilters, getCheckedSchoolIds, getCheckedSchools
- `HomeService.js`: parseCoordinate, hasCoordinates, calculateDistanceInMiles, filterHouseSchools, applyHomeFilters, getHouseDetailSchoolFilters
- `SavedHousesService.js`: isHouseSaved, toggleSavedHouse, persistSavedHouses, loadSavedHouses, updateSaveButtons
- `MapService.js`: initializeMap, initializeDetailMap, renderMapForSchool, renderHouseDetailMap, searchHomesNearSchool, searchHomesForAllSelectedSchools

**Components (24+ files across hierarchical structure):**
- SchoolDirectory: SchoolDirectory.js, SchoolRow.js, SchoolFilter.js
- HomesList: HomesList.js, HomeCard.js, HomeFilter.js, HomeMap.js
- HouseDetail: HouseDetail.js, HouseDetailInfo.js, HouseDetailMap.js, SchoolFilterDetail.js, NearbySchoolsList.js
- SavedHomes: SavedHomes.js, SavedHomesSidebar.js, SavedHomesGrid.js
- SchoolSearch: SchoolSearch.js, SchoolSuggestions.js
- SchoolSearchHome.js
- Navigation.js
- AppShell.js

**Utilities (4 files):**
- `formatters.js`: currency, formatSchoolAddress
- `validators.js`: hasCoordinates, isHouseSaved
- `calculations.js`: calculateDistanceInMiles, getSchoolMatchScore
- `normalizers.js`: normalizeText, normalizeSearchText, normalizeOptionalText, normalizeSchoolLevel, normalizeSchoolType, parseCoordinate
- `constants.js`: DATA_PATHS, SCHOOL_ICON_URL, SCHOOL_LEVEL_LABELS

**Styles (5 files):**
- Refactor monolithic `styles.css` into modular CSS files per component + global styles

### **Files Eliminated Through Consolidation:**
1. `createHomeCard.js` → HomeCard component
2. `applyHomeFilters.js` → HomeFilter component + HomeService
3. `renderHomes.js` → HomesList component
4. `renderSchoolsList.js` → SchoolDirectory/SchoolRow components
5. `renderSavedHouses.js` → SavedHomes components
6. `renderHouseDetailView.js` → HouseDetail component
7. `applySchoolFilters.js` → SchoolFilter component + SchoolService
8. `applyHouseDetailFilters.js` → SchoolFilterDetail component
9. `initializeMap.js`, `renderMapForSchool.js`, `initializeDetailMap.js`, `renderHouseDetailMap.js` → MapService + HomeMap/HouseDetailMap components
10. All normalization files → SchoolService + utils/normalizers.js
11. `bindEvents.js` → Distributed across component classes
12. `loadData.js` → DataService + AppShell initialization
13. `switchTab.js` → Navigation component
14. All school suggestion functions → SchoolSuggestions component
15. Saved houses functions → SavedHousesService + SavedHomes components

---

## Key Architectural Decisions

1. **UIComponent Base Class**: All UI components extend this class for:
   - DOM element creation/manipulation
   - Event listener management
   - Re-rendering logic
   - Lifecycle hooks (mount, unmount, update)

2. **Services**: Business logic and data processing separated from rendering
   - No DOM manipulation in services
   - Pure functions where possible
   - Single responsibility per service

3. **Components**: Self-contained units with:
   - Class extending UIComponent
   - Associated CSS file
   - Clear props/state management
   - Encapsulated event handling

4. **State Management**: Centralized in StateManager
   - Single source of truth for global data
   - Reactive updates (notify observers when state changes)
   - No direct DOM manipulation from state

5. **CSS Organization**: 
   - Component-scoped styles colocated with component
   - Shared global styles in `/styles/main.css`
   - Design tokens in `/styles/colors.css`, `/styles/typography.css`

6. **Vite Integration**:
   - `main.js` as single entry point
   - ES modules throughout
   - CSS imported in JS files for proper bundling
   - Asset optimization via Vite build

---

## Implementation Phases (Will Execute in Order)

1. **Phase 1: Core Infrastructure** — Create base classes and services
2. **Phase 2: Utilities** — Refactor utility functions into pure modules
3. **Phase 3: Components (Bottom-Up)** — Build leaf components first (HomeCard, SchoolRow), then composite components
4. **Phase 4: Integration** — Wire up event handlers, state synchronization, persistence
5. **Phase 5: Styling** — Migrate and organize CSS
6. **Phase 6: Testing & Refinement** — Verify functionality, optimize

---

## Strict Technical Constraints

### 1. **HTML Mounting & Component Rendering (SPA Model)**
   - **Constraint**: We are implementing a true Single Page Application (SPA) model.
   - **Rule**: Do NOT attach classes to existing hardcoded DOM elements in `index.html`.
   - **Action**: `index.html` will be stripped down to a single `<div id="app"></div>`.
   - **Implementation**: Every UI component must define its own HTML structure using **ES6 Template Literals** returned by a `render()` method.
   - **Mount Strategy**: The parent `AppShell` will dynamically mount component HTML into the DOM via the render method.
   - **Benefits**: Complete component encapsulation, no hidden dependencies on HTML structure, true modularity.

### 2. **The Leaflet Map Lifecycle**
   - **Constraint**: Leaflet maps must be explicitly cleaned up to prevent fatal "Map container is already initialized" errors.
   - **Rule**: `MapService`, `HomeMap`, and `HouseDetailMap` must implement explicit map destruction.
   - **Implementation**: Before re-initializing a map:
     1. Check if map instance exists
     2. Call `map.remove()` to destroy the Leaflet instance
     3. Clear all marker layers: `markersLayer.clearLayers()`
     4. Set instance to `null`
     5. Only then initialize a new map instance
   - **Lifecycle Hooks**: Components must implement:
     - `mount()` — Initialize Leaflet instance and layers
     - `render()` — Update markers, bounds, popups
     - `destroy()` — Clean up Leaflet, prevent memory leaks
   - **Edge Case**: Tab switching (Schools → Homes → Detail → Back) must properly destroy and recreate maps.

### 3. **StateManager via Observer Pattern (Pub/Sub)**
   - **Constraint**: Centralized reactive state management without direct mutations.
   - **Rule**: StateManager must implement strict Pub/Sub (Observer) pattern.
   - **Subscribe Syntax**: `state.subscribe('stateKey', callbackFunction)`
     - Example: `state.subscribe('activeFilters', this.reRender.bind(this))`
   - **Mutation Rule**: State updates ONLY via explicit setter methods, NEVER direct mutations.
     - ❌ DON'T: `state.houses = newHouses`
     - ✅ DO: `state.set('houses', newHouses)` → triggers observers
   - **Watchers**: Components subscribed to state changes are automatically notified and can trigger re-renders.
   - **Key State Branches to Manage**:
     - `houses`, `schools`, `filteredHomes`, `schoolsFiltered`
     - `savedHouses`, `activeTab`, `currentHouseDetail`, `lastSelectedSchool`
     - `activeSchoolFilters`, `activeHomeFilters`, `activeDetailFilters`

### 4. **CSS Scoping & Module Styling**
   - **Constraint**: Prevent CSS class name collisions and style leakage across components.
   - **Method**: BEM (Block Element Modifier) naming convention + CSS Modules or scoped styles.
   - **Pattern**:
     ```css
     /* In HomeCard.css */
     .homeCard { /* Block */ }
     .homeCard__title { /* Element */ }
     .homeCard__price { /* Element */ }
     .homeCard__price--highlight { /* Modifier */ }
     .homeCard--saved { /* Modifier */ }
     ```
   - **Implementation**: Either:
     - CSS Modules (`.module.css` files, import as JS objects) — **Recommended for Vite**
     - CSS Scoping strategy (unique prefixes per component)
     - Shadow DOM for complete isolation (if needed)
   - **Global Styles**: Only layout, typography, reset, and design tokens in `/styles/main.css`.

### 5. **Data Loading States & Error Boundaries**
   - **Constraint**: Every async operation must handle loading, success, and error states.
   - **Loading States**: Components must render loading spinners/skeletons while data fetches.
   - **Pattern**:
     ```javascript
     class HomesList extends UIComponent {
       render() {
         if (this.state === 'loading') return '<div class="spinner">Loading homes...</div>';
         if (this.state === 'error') return '<div class="error">Failed to load homes</div>';
         return this.renderHomes(); // Success state
       }
     }
     ```
   - **Error Boundaries**: AppShell must catch errors from child components and display fallback UI.
     - No silent failures; all errors logged to console and user-facing message displayed.
     - Specific error handling for:
       - Failed data loads (network errors)
       - Invalid coordinates (homes/schools without lat/lon)
       - Map initialization failures
       - Persist failures (localStorage errors)

### 6. **Event Delegation & Memory Management**
   - **Constraint**: Prevent memory leaks from event listeners.
   - **Rule**: All event listeners must be explicitly removed on component destruction.
   - **Pattern**:
     ```javascript
     class SchoolRow extends UIComponent {
       mount(container) {
         this.element = this.render();
         this.element.addEventListener('click', this.onClick.bind(this));
         container.appendChild(this.element);
       }
       destroy() {
         this.element?.removeEventListener('click', this.onClick.bind(this));
         this.element?.remove();
       }
     }
     ```
   - **Event Delegation**: Use parent container listeners instead of individual listeners for large lists.

### 7. **Coordinate & Geometry Validation**
   - **Constraint**: Never trust external data; always validate before using in maps or calculations.
   - **Rule**: Every home/school with coordinates must pass `hasCoordinates(item)` validation.
   - **Pattern**: Filter data at service layer:
     ```javascript
     // In SchoolService
     getNearbySchools(home, radiusMiles = 5) {
       return this.schools
         .filter(school => hasCoordinates(school))
         .map(school => ({...school, distance: calculateDistance(...)}))
         .filter(s => s.distance <= radiusMiles);
     }
     ```
   - **Edge Cases**: 
     - Missing lat/lon (skip silently)
     - Invalid numbers (0, NaN, null) — treat as invalid
     - String coordinates instead of numbers — parse and validate

### 8. **Persistence & LocalStorage Handling**
   - **Constraint**: SavedHousesService must handle localStorage safely.
   - **Rule**: Always wrap localStorage in try/catch.
   - **Pattern**:
     ```javascript
     save() {
       try {
         localStorage.setItem('savedHouses', JSON.stringify(this.houses));
       } catch (e) {
         console.error('Failed to persist saved houses:', e);
         // Notify user or handle gracefully
       }
     }
     ```
   - **Fallback**: If localStorage unavailable, store in-memory only and warn user.

### 9. **Async Data Initialization Sequence**
   - **Constraint**: Components must not render before data is available.
   - **Sequence**:
     1. AppShell mounts to DOM
     2. DataService loads houses & schools JSON
     3. StateManager hydrates with normalized data
     4. Components subscribe to state keys
     5. Each component renders once data available
     6. SavedHousesService loads from localStorage
   - **Never render** component tabs before data loaded (empty states OK, but structure must exist).

### 10. **Performance Optimization Requirements**
   - **Constraint**: App must remain performant with hundreds of homes/schools.
   - **Rules**:
     - Lazy-render large lists (virtualization for 500+ items)
     - Debounce search input (300ms)
     - Memoize expensive calculations (distance, filtering)
     - Batch DOM updates (use DocumentFragment for bulk inserts)
     - Unsubscribe from state watchers when component destroyed

---

## Success Criteria

✓ All 54 files consolidated into organized structure  
✓ Zero loss of functionality — app works identically  
✓ Full ES6 class usage for components and services  
✓ Proper module imports/exports throughout  
✓ Component-scoped CSS with BEM naming or CSS Modules  
✓ No global function pollution  
✓ SPA model with single `<div id="app"></div>` in HTML  
✓ All components use `render()` method with Template Literals  
✓ StateManager implements strict Pub/Sub pattern  
✓ Map lifecycle properly managed (destroy + re-initialize)  
✓ All async operations have loading/error states  
✓ Event listeners cleaned up on component destruction  
✓ Vite dev server works correctly  
✓ Production build succeeds  
✓ No 'Map container is already initialized' errors  
✓ localStorage safely handled with fallbacks