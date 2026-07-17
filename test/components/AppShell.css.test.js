const { readSource, expectCssStructure } = require("../sourceTestUtils");

describe("AppShell component CSS coverage", () => {
  test("AppShell.css exists with valid CSS structure", () => {
    const content = readSource(["src", "components", "AppShell", "AppShell.css"]);
    expectCssStructure(content);
  });

  test("AppShell.css contains selector hooks", () => {
    const content = readSource(["src", "components", "AppShell", "AppShell.css"]);
    expect(content).toMatch(/[.#][a-zA-Z0-9_-]+/);
  });
});
