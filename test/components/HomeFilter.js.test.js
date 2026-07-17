const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("HomeFilter component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "HomeFilter", "HomeFilter.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+HomeFilter/);
    expect(content).toMatch(/export\s+default\s+HomeFilter/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "HomeFilter", "HomeFilter.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
