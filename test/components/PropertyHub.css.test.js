const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("PropertyHub component CSS coverage", () => {
  test("PropertyHub.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "PropertyHub", "PropertyHub.css"]);
    expectCssStructure(content);
  });

  test("PropertyHub.css contains selector hooks", () => {
    const content = readSource(["src", "components", "PropertyHub", "PropertyHub.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
