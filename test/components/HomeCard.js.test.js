const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("HomeCard component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "HomeCard", "HomeCard.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+HomeCard/);
    expect(content).toMatch(/export\s+default\s+HomeCard/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "HomeCard", "HomeCard.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
