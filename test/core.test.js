const {
  readSource,
  expectNonEmptyText
} = require("./sourceTestUtils");

describe("src/core directory coverage", () => {
  test("StateManager exposes core state APIs", () => {
    const stateManager = readSource(["src", "core", "StateManager.js"]);
    expectNonEmptyText(stateManager);
    expect(stateManager).toMatch(/export\s+class\s+StateManager/);
    expect(stateManager).toMatch(/set\s*\(/);
    expect(stateManager).toMatch(/batchUpdate\s*\(/);
    expect(stateManager).toMatch(/subscribe\s*\(/);
    expect(stateManager).toMatch(/initializeAppState\s*\(/);
    expect(stateManager).toMatch(/export\s+default\s+StateManager/);
  });

  test("DataService exposes load and normalization APIs", () => {
    const dataService = readSource(["src", "core", "DataService.js"]);
    expectNonEmptyText(dataService);
    expect(dataService).toMatch(/export\s+class\s+DataService/);
    expect(dataService).toMatch(/loadAppData\s*\(/);
    expect(dataService).toMatch(/normalizeHouses\s*\(/);
    expect(dataService).toMatch(/normalizeSchools\s*\(/);
    expect(dataService).toMatch(/export\s+default\s+DataService/);
  });

  test("MapService exposes map lifecycle APIs", () => {
    const mapService = readSource(["src", "core", "MapService.js"]);
    expectNonEmptyText(mapService);
    expect(mapService).toMatch(/export\s+class\s+MapService/);
    expect(mapService).toMatch(/initializeMap\s*\(/);
    expect(mapService).toMatch(/addMarkersToMap\s*\(/);
    expect(mapService).toMatch(/destroyMap\s*\(/);
    expect(mapService).toMatch(/destroy\s*\(/);
    expect(mapService).toMatch(/export\s+default\s+MapService/);
  });

  test("UIComponent exposes lifecycle helpers", () => {
    const uiComponent = readSource(["src", "core", "UIComponent.js"]);
    expectNonEmptyText(uiComponent);
    expect(uiComponent).toMatch(/export\s+class\s+UIComponent/);
    expect(uiComponent).toMatch(/mount\s*\(/);
    expect(uiComponent).toMatch(/update\s*\(/);
    expect(uiComponent).toMatch(/addEventListener\s*\(/);
    expect(uiComponent).toMatch(/destroy\s*\(/);
    expect(uiComponent).toMatch(/export\s+default\s+UIComponent/);
  });
});
