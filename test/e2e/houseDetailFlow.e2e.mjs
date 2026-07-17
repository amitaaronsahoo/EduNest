import { By } from "selenium-webdriver";
import {
  assert,
  clickWhenVisible,
  createChromeDriver,
  DEFAULT_BASE_URL,
  getTextWhenVisible,
  openApp,
  openFirstHomeCard,
  searchHomesNearSchool,
  waitForVisible
} from "./e2eTestUtils.mjs";

export async function runHouseDetailFlow(baseUrl = DEFAULT_BASE_URL) {
  const driver = await createChromeDriver();

  try {
    await openApp(driver, baseUrl);
    await searchHomesNearSchool(driver, "Dupont Manual");
    await openFirstHomeCard(driver);

    await waitForVisible(driver, By.id("houseNearbySchools"));
    await clickWhenVisible(driver, By.id("houseApplySchoolFiltersBtn"));

    const schoolResultText = await getTextWhenVisible(driver, By.id("houseSchoolResults"));
    const stableState =
      schoolResultText.toLowerCase().includes("nearby school") ||
      schoolResultText.toLowerCase().includes("no nearby schools");
    assert(stableState, `Expected nearby school status text, got "${schoolResultText}"`);

    const viewButtons = await driver.findElements(By.css("#houseNearbySchools .view-school-btn"));
    if (viewButtons.length > 0) {
      await viewButtons[0].click();
      await waitForVisible(driver, By.id("detailMap"));
    }

    await clickWhenVisible(driver, By.id("detailBackBtn"));
    await waitForVisible(driver, By.id("homes-content"));
  } finally {
    await driver.quit();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  await runHouseDetailFlow();
  console.log("✅ houseDetailFlow.e2e.mjs passed");
}
