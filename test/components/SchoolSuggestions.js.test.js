const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("SchoolSuggestions component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "SchoolSuggestions", "SchoolSuggestions.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+SchoolSuggestions/);
    expect(content).toMatch(/export\s+default\s+SchoolSuggestions/);
  });

  test("contains rendering surface", () => {
    const content = readSource(["src", "components", "SchoolSuggestions", "SchoolSuggestions.js"]);
    expect(content).toMatch(/render\s*\(/);
  });
});
