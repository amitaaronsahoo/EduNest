import { By } from "selenium-webdriver";
import {
  assert,
  createChromeDriver,
  DEFAULT_BASE_URL,
  isSectionVisible,
  openApp,
  openTabFromLanding,
  openTabFromNav
} from "./e2eTestUtils.mjs";

export async function runLandingNavigationFlow(baseUrl = DEFAULT_BASE_URL) {
  const driver = await createChromeDriver();

  try {
    await openApp(driver, baseUrl);

    await openTabFromLanding(driver, "homes");
    assert(await isSectionVisible(driver, "homes-content"), "Homes section should be visible");

    await openTabFromNav(driver, "saved");
    assert(await isSectionVisible(driver, "saved-content"), "Saved homes section should be visible");

    await openTabFromNav(driver, "schools");
    assert(await isSectionVisible(driver, "schools-content"), "Schools section should be visible");

    await driver.findElement(By.id("app-nav"));
  } finally {
    await driver.quit();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  await runLandingNavigationFlow();
  console.log("✅ landingNavigation.e2e.mjs passed");
}
