const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

function toAbsolutePath(pathSegments) {
  return path.join(projectRoot, ...pathSegments);
}

function expectFileExists(pathSegments) {
  const absolutePath = toAbsolutePath(pathSegments);
  expect(fs.existsSync(absolutePath)).toBe(true);
  return absolutePath;
}

function readSource(pathSegments) {
  const absolutePath = expectFileExists(pathSegments);
  return fs.readFileSync(absolutePath, "utf8");
}

function expectNonEmptyText(content) {
  expect(typeof content).toBe("string");
  expect(content.trim().length).toBeGreaterThan(0);
}

function expectCssStructure(content) {
  expectNonEmptyText(content);
  expect(content).toMatch(/\{/);
  expect(content).toMatch(/\}/);
  expect(content).toMatch(/[.#a-zA-Z][^{]*\{/);
}

module.exports = {
  expectFileExists,
  readSource,
  expectNonEmptyText,
  expectCssStructure
};
