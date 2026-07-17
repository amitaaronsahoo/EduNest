const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("HouseDetail component CSS coverage", () => {
  test("HouseDetail.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "HouseDetail", "HouseDetail.css"]);
    expectCssStructure(content);
  });

  test("HouseDetail.css contains selector hooks", () => {
    const content = readSource(["src", "components", "HouseDetail", "HouseDetail.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
