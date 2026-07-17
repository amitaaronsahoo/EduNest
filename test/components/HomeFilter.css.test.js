const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("HomeFilter component CSS coverage", () => {
  test("HomeFilter.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "HomeFilter", "HomeFilter.css"]);
    expectCssStructure(content);
  });

  test("HomeFilter.css contains selector hooks", () => {
    const content = readSource(["src", "components", "HomeFilter", "HomeFilter.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
