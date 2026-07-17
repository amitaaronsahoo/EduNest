const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SchoolRow component CSS coverage", () => {
  test("SchoolRow.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SchoolRow", "SchoolRow.css"]);
    expectCssStructure(content);
  });

  test("SchoolRow.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SchoolRow", "SchoolRow.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
