const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("HouseDetail component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "HouseDetail", "HouseDetail.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+HouseDetail/);
    expect(content).toMatch(/export\s+default\s+HouseDetail/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "HouseDetail", "HouseDetail.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
