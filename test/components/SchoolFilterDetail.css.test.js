const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SchoolFilterDetail component CSS coverage", () => {
  test("SchoolFilterDetail.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SchoolFilterDetail", "SchoolFilterDetail.css"]);
    expectCssStructure(content);
  });

  test("SchoolFilterDetail.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SchoolFilterDetail", "SchoolFilterDetail.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
