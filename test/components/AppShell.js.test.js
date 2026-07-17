const { readSource, expectNonEmptyText } = require("../sourceTestUtils");

describe("AppShell component JS coverage", () => {
  test("module exists and exports a class", () => {
    const content = readSource(["src", "components", "AppShell", "AppShell.js"]);
    expectNonEmptyText(content);
    expect(content).toMatch(/export\s+(class|default\s+class)\s+AppShell/);
    expect(content).toMatch(/export\s+default\s+AppShell/);
  });

  test("contains rendering and mount lifecycle hooks", () => {
    const content = readSource(["src", "components", "AppShell", "AppShell.js"]);
    expect(content).toMatch(/render\s*\(/);
    expect(content).toMatch(/onMounted\s*\(/);
  });
});
