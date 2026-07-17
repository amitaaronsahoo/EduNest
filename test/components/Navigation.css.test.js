const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("Navigation component CSS coverage", () => {
  test("Navigation.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "Navigation", "Navigation.css"]);
    expectCssStructure(content);
  });

  test("Navigation.css contains selector hooks", () => {
    const content = readSource(["src", "components", "Navigation", "Navigation.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
