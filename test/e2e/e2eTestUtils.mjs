import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

export const DEFAULT_BASE_URL = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const DEFAULT_TIMEOUT_MS = 15000;

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function createChromeDriver() {
  const options = new chrome.Options();
  const runHeadless = process.env.E2E_HEADLESS !== "false";

  if (runHeadless) {
    options.addArguments("--headless=new");
  }

  options.addArguments("--window-size=1440,900");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

export async function openApp(driver, baseUrl = DEFAULT_BASE_URL) {
  await driver.get(baseUrl);
  await waitForVisible(driver, By.id("landing-content"));
}

export async function waitForVisible(driver, locator, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const element = await driver.wait(until.elementLocated(locator), timeoutMs);
  await driver.wait(until.elementIsVisible(element), timeoutMs);
  return element;
}

export async function clickWhenVisible(driver, locator, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const element = await waitForVisible(driver, locator, timeoutMs);
  await element.click();
}

export async function typeWhenVisible(driver, locator, value, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const element = await waitForVisible(driver, locator, timeoutMs);
  await element.clear();
  await element.sendKeys(value);
}

export async function getTextWhenVisible(driver, locator, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const element = await waitForVisible(driver, locator, timeoutMs);
  return element.getText();
}

export async function waitForTextContains(driver, locator, expected, timeoutMs = DEFAULT_TIMEOUT_MS) {
  await driver.wait(async () => {
    const element = await driver.findElement(locator);
    const text = await element.getText();
    return text.includes(expected);
  }, timeoutMs, `Expected ${locator} text to include "${expected}"`);
}

export async function isSectionVisible(driver, sectionId) {
  const section = await waitForVisible(driver, By.id(sectionId));
  return section.isDisplayed();
}

export async function openTabFromLanding(driver, tabName) {
  await clickWhenVisible(driver, By.css(`#landing-content [data-tab="${tabName}"]`));
}

export async function openTabFromNav(driver, tabName) {
  await clickWhenVisible(driver, By.css(`#app-nav [data-tab="${tabName}"]`));
}

export async function searchHomesNearSchool(driver, schoolQuery = "Dupont Manual") {
  await openTabFromLanding(driver, "homes");
  await typeWhenVisible(driver, By.id("schoolSearchHome"), schoolQuery);
  await clickWhenVisible(driver, By.id("schoolSearchHomeBtn"));
  await waitForVisible(driver, By.id("homeResults"));
}

export async function getHomeCardCount(driver) {
  const cards = await driver.findElements(By.css("#results [data-home-id]"));
  return cards.length;
}

export async function openFirstHomeCard(driver) {
  await waitForVisible(driver, By.css("#results [data-home-id]"));
  const cards = await driver.findElements(By.css("#results [data-home-id]"));
  assert(cards.length > 0, "Expected at least one home card in #results");
  await cards[0].click();
  await waitForVisible(driver, By.id("house-details-content"));
}
