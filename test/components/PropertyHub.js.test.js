const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("PropertyHub component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "PropertyHub", "PropertyHub.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+default\s+class\s+PropertyHub/);
  });

  test("contains rendering and interaction surfaces", () => {
    const content = readSource(["src", "components", "PropertyHub", "PropertyHub.js"]);
    expect(content).toMatch(/render\s*\(/);
    expect(content).toMatch(/bindEvents\s*\(/);
  });
});
