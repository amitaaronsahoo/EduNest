const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SchoolSearchHome component CSS coverage", () => {
  test("SchoolSearchHome.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SchoolSearchHome", "SchoolSearchHome.css"]);
    expectCssStructure(content);
  });

  test("SchoolSearchHome.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SchoolSearchHome", "SchoolSearchHome.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
