const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("HomesList component CSS coverage", () => {
  test("HomesList.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "HomesList", "HomesList.css"]);
    expectCssStructure(content);
  });

  test("HomesList.css contains selector hooks", () => {
    const content = readSource(["src", "components", "HomesList", "HomesList.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
