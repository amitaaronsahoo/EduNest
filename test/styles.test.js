const {
  readSource,
  expectCssStructure
} = require("./sourceTestUtils");

describe("src/styles directory coverage", () => {
  const styleFiles = [
    ["src", "styles", "main.css"],
    ["src", "styles", "colors.css"],
    ["src", "styles", "layout.css"],
    ["src", "styles", "components.css"],
    ["src", "styles", "typography.css"]
  ];

  test.each(styleFiles)("%s/%s/%s is valid CSS structure", (...segments) => {
    const content = readSource(segments);
    expectCssStructure(content);
  });

  test("main.css imports the shared style modules", () => {
    const mainCss = readSource(["src", "styles", "main.css"]);
    expect(mainCss).toContain('@import "./colors.css"');
    expect(mainCss).toContain('@import "./typography.css"');
    expect(mainCss).toContain('@import "./layout.css"');
    expect(mainCss).toContain('@import "./components.css"');
  });
});
