import { By } from "selenium-webdriver";
import {
  assert,
  clickWhenVisible,
  createChromeDriver,
  DEFAULT_BASE_URL,
  getTextWhenVisible,
  openApp,
  searchHomesNearSchool,
  waitForVisible
} from "./e2eTestUtils.mjs";

export async function runHomesFlow(baseUrl = DEFAULT_BASE_URL) {
  const driver = await createChromeDriver();

  try {
    await openApp(driver, baseUrl);
    await searchHomesNearSchool(driver, "Dupont Manual");

    const statusText = await getTextWhenVisible(driver, By.id("homeResults"));
    assert(statusText.toLowerCase().includes("home"), "Expected homes status to describe home results");

    await clickWhenVisible(driver, By.css('#minBedrooms option[value="2"]'));
    await clickWhenVisible(driver, By.css('#homeSort option[value="price-asc"]'));
    await clickWhenVisible(driver, By.id("applyFiltersHomeBtn"));

    await waitForVisible(driver, By.id("results"));
    const updatedStatusText = await getTextWhenVisible(driver, By.id("homeResults"));
    assert(updatedStatusText.toLowerCase().includes("home"), "Expected filtered homes status to describe home results");
  } finally {
    await driver.quit();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  await runHomesFlow();
  console.log("✅ homesFlow.e2e.mjs passed");
}
