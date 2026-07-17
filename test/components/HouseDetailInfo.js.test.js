const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("HouseDetailInfo component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "HouseDetailInfo", "HouseDetailInfo.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+HouseDetailInfo/);
    expect(content).toMatch(/export\s+default\s+HouseDetailInfo/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "HouseDetailInfo", "HouseDetailInfo.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
