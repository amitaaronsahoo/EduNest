const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("SavedHomes component CSS coverage", () => {
  test("SavedHomes.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "SavedHomes", "SavedHomes.css"]);
    expectCssStructure(content);
  });

  test("SavedHomes.css contains selector hooks", () => {
    const content = readSource(["src", "components", "SavedHomes", "SavedHomes.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
