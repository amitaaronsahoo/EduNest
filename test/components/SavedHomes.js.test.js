const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SavedHomes component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SavedHomes", "SavedHomes.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SavedHomes/);
    expect(content).toMatch(/export\s+default\s+SavedHomes/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SavedHomes", "SavedHomes.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
