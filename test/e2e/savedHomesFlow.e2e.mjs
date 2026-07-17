import { By } from "selenium-webdriver";
import {
  assert,
  clickWhenVisible,
  createChromeDriver,
  DEFAULT_BASE_URL,
  getTextWhenVisible,
  openApp,
  openFirstHomeCard,
  openTabFromNav,
  searchHomesNearSchool,
  waitForVisible
} from "./e2eTestUtils.mjs";

function parseSavedCount(text) {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export async function runSavedHomesFlow(baseUrl = DEFAULT_BASE_URL) {
  const driver = await createChromeDriver();

  try {
    await openApp(driver, baseUrl);
    await searchHomesNearSchool(driver, "Dupont Manual");
    await openFirstHomeCard(driver);

    await clickWhenVisible(driver, By.css('#houseDetailInfo [data-action="toggle-save"]'));
    await openTabFromNav(driver, "saved");
    await waitForVisible(driver, By.id("saved-content"));

    const savedCountText = await getTextWhenVisible(driver, By.id("savedHousesCount"));
    const savedCount = parseSavedCount(savedCountText);
    assert(savedCount > 0, `Expected saved homes count to be > 0, got "${savedCountText}"`);

    await waitForVisible(driver, By.css("#savedHouses [data-home-id]"));
  } finally {
    await driver.quit();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  await runSavedHomesFlow();
  console.log("✅ savedHomesFlow.e2e.mjs passed");
}
