const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("HouseDetailInfo component CSS coverage", () => {
  test("HouseDetailInfo.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "HouseDetailInfo", "HouseDetailInfo.css"]);
    expectCssStructure(content);
  });

  test("HouseDetailInfo.css contains selector hooks", () => {
    const content = readSource(["src", "components", "HouseDetailInfo", "HouseDetailInfo.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
