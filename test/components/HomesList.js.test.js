const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("HomesList component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "HomesList", "HomesList.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+HomesList/);
    expect(content).toMatch(/export\s+default\s+HomesList/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "HomesList", "HomesList.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
