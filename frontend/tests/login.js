import { Builder, By, Key, until } from "selenium-webdriver";

(async function login() {
  let driver1 = await new Builder().forBrowser("chrome").build();
  let driver2 = await new Builder().forBrowser("chrome").build();

  try {
    await driver1.get("http://localhost:5173/login");
    await driver1.sleep(2000);

    await driver2.get("http://localhost:5173/login");
    await driver2.sleep(2000);

    let username1 = await driver1.wait(
      until.elementLocated(By.name("username")),
      2000
    );
    await driver1.sleep(2000);
    await username1.sendKeys("raghav");

    let password1 = await driver1.wait(
      until.elementLocated(By.name("password")),
      2000
    );
    await driver1.sleep(2000);
    await password1.sendKeys("raghav123");

    await driver1.sleep(2000);
    await password1.sendKeys(Key.RETURN);
    await driver1.sleep(2000);

    let username2 = await driver2.wait(
      until.elementLocated(By.name("username")),
      2000
    );
    await driver2.sleep(2000);
    await username2.sendKeys("test");

    let password2 = await driver2.wait(
      until.elementLocated(By.name("password")),
      2000
    );
    await driver2.sleep(2000);
    await password2.sendKeys("test123");

    await driver2.sleep(2000);
    await password2.sendKeys(Key.RETURN);
    await driver2.sleep(2000);

    let menuBtn1 = await driver1.wait(
      until.elementLocated(By.name("menu-icon")),
      2000
    );
    await driver1.sleep(2000);
    await menuBtn1.click();

    let menuBtn2 = await driver2.wait(
      until.elementLocated(By.name("menu-icon")),
      2000
    );
    await driver2.sleep(2000);
    await menuBtn2.click();

    await driver1.sleep(2000);
    await driver2.sleep(2000);

    let chat1 = await driver1.wait(
      until.elementLocated(By.css("#chats > *:first-child")),
      2000
    );
    await driver1.sleep(2000);
    await chat1.click();

    let chat2 = await driver2.wait(
      until.elementLocated(By.css("#chats > *:first-child")),
      2000
    );
    await driver2.sleep(2000);
    await chat2.click();

    await driver1.sleep(2000);
    await driver2.sleep(2000);

    let msgInput1 = await driver1.wait(
      until.elementLocated(By.name("message-input-box")),
      2000
    );
    await driver1.sleep(2000);
    await msgInput1.click();

    let msgInput2 = await driver2.wait(
      until.elementLocated(By.name("message-input-box")),
      2000
    );
    await driver2.sleep(2000);
    await msgInput2.click();

    await msgInput1.sendKeys("hello from raghav");
    await driver1.sleep(1000);
    await msgInput1.sendKeys(Key.RETURN);
    await driver1.sleep(2000);

    await msgInput2.sendKeys("hello from test");
    await driver2.sleep(1000);
    await msgInput2.sendKeys(Key.RETURN);
    await driver2.sleep(2000);

    await driver1.sleep(2000);
    await driver2.sleep(2000);
  } catch (error) {
    console.log(error);
  } finally {
    await driver1.quit();
    await driver2.quit();
  }
})();
