import { Builder, By, until } from "selenium-webdriver";

const driver = await new Builder()
    .forBrowser("chrome")
    .build();

try {
    await driver.get("http://localhost:5173");

    const tab = await driver.wait(
        until.elementLocated(By.css('button[data-tab="homes"].landing-action')),
        10000
    );

    await driver.wait(until.elementIsVisible(tab), 10000);
    await tab.click();


const elements = await driver.findElements(
    By.id("schoolSearchHome")
);

console.log("Found", elements.length, "elements");

    const homeSearchBar = await driver.wait(
        until.elementLocated(By.id("schoolSearchHome")),
        10000
    );

await driver.wait(until.elementIsVisible(homeSearchBar), 10000);
await homeSearchBar.sendKeys("Dupont Manual");

    const searchBtn = await driver.findElement(By.id("schoolSearchHomeBtn"));

    await driver.wait(until.elementIsVisible(searchBtn), 10000);
    await searchBtn.click();

    const homeResults = await driver.wait(
        until.elementLocated(By.id("homeResults")),
        10000
    );

    const text = await homeResults.getText();

    console.log("Results:", text);

    if (text == "Showing 1-25 of 314 homes found") {
        console.log("✅ Test passed");
    } else {
        console.log("❌ Test failed");
    }

} finally {
    await driver.quit();
}