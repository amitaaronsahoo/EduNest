const {
  readSource,
  expectNonEmptyText
} = require("./sourceTestUtils");

describe("src/main.js coverage", () => {
  test("main entry imports application services and AppShell", () => {
    const mainFile = readSource(["src", "main.js"]);
    expectNonEmptyText(mainFile);
    expect(mainFile).toContain('import "./styles/main.css";');
    expect(mainFile).toContain('import { StateManager } from "./core/StateManager.js";');
    expect(mainFile).toContain('import { DataService } from "./core/DataService.js";');
    expect(mainFile).toContain('import { MapService } from "./core/MapService.js";');
    expect(mainFile).toContain('import AppShell from "./components/AppShell/AppShell.js";');
  });

  test("main entry wires DOMContentLoaded bootstrapping", () => {
    const mainFile = readSource(["src", "main.js"]);
    expect(mainFile).toMatch(/document\.addEventListener\("DOMContentLoaded"/);
    expect(mainFile).toMatch(/document\.getElementById\("app"\)/);
    expect(mainFile).toMatch(/new\s+AppShell\s*\(/);
    expect(mainFile).toMatch(/app\.mount\(appRoot\)/);
  });
});
