const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SchoolFilter component CSS coverage", () => {
  test("SchoolFilter.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SchoolFilter", "SchoolFilter.css"]);
    expectCssStructure(content);
  });

  test("SchoolFilter.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SchoolFilter", "SchoolFilter.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
