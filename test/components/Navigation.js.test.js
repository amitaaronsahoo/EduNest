const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("Navigation component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "Navigation", "Navigation.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+Navigation/);
    expect(content).toMatch(/export\s+default\s+Navigation/);
  });

  test("contains rendering and mount surfaces", () => {
    const content = readSource(["src", "components", "Navigation", "Navigation.js"]);
    expect(content).toMatch(/render\s*\(/);
    expect(content).toMatch(/onMounted\s*\(/);
  });
});
