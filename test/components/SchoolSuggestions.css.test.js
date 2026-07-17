const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SchoolSuggestions component CSS coverage", () => {
  test("SchoolSuggestions.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SchoolSuggestions", "SchoolSuggestions.css"]);
    expectCssStructure(content);
  });

  test("SchoolSuggestions.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SchoolSuggestions", "SchoolSuggestions.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
