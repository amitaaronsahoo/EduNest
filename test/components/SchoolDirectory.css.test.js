const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SchoolDirectory component CSS coverage", () => {
  test("SchoolDirectory.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SchoolDirectory", "SchoolDirectory.css"]);
    expectCssStructure(content);
  });

  test("SchoolDirectory.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SchoolDirectory", "SchoolDirectory.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
