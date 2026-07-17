const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SchoolSearch component CSS coverage", () => {
  test("SchoolSearch.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SchoolSearch", "SchoolSearch.css"]);
    expectCssStructure(content);
  });

  test("SchoolSearch.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SchoolSearch", "SchoolSearch.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
