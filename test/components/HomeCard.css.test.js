const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("HomeCard component CSS coverage", () => {
  test("HomeCard.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "HomeCard", "HomeCard.css"]);
    expectCssStructure(content);
  });

  test("HomeCard.css contains selector hooks", () => {
    const content = readSource(["src", "components", "HomeCard", "HomeCard.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
