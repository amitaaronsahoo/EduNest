import { By } from "selenium-webdriver";
import {
  assert,
  clickWhenVisible,
  createChromeDriver,
  DEFAULT_BASE_URL,
  isSectionVisible,
  openApp,
  openTabFromLanding,
  waitForVisible
} from "./e2eTestUtils.mjs";

export async function runSchoolsFlow(baseUrl = DEFAULT_BASE_URL) {
  const driver = await createChromeDriver();

  try {
    await openApp(driver, baseUrl);
    await openTabFromLanding(driver, "schools");
    assert(await isSectionVisible(driver, "schools-content"), "Schools content should be visible");

    const searchInput = await waitForVisible(driver, By.id("schoolSearch"));
    await searchInput.sendKeys("Manual");
    await clickWhenVisible(driver, By.id("schoolSearchBtn"));

    await waitForVisible(driver, By.id("schoolsTableBody"));
    const rows = await driver.findElements(By.css("#schoolsTableBody .school-row"));
    assert(rows.length > 0, "Expected school search to render at least one school row");

    const checkboxes = await driver.findElements(By.css('#schoolsTableBody [data-action="toggle-school"]'));
    assert(checkboxes.length > 0, "Expected selectable school checkboxes");
    await checkboxes[0].click();
    assert(await checkboxes[0].isSelected(), "Expected selected school checkbox to be checked");

    await clickWhenVisible(driver, By.id("allSchoolBtn"));
    assert(await isSectionVisible(driver, "homes-content"), "Homes content should be shown after selecting schools");
    await waitForVisible(driver, By.id("results"));
  } finally {
    await driver.quit();
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  await runSchoolsFlow();
  console.log("✅ schoolsFlow.e2e.mjs passed");
}
