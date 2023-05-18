const fs = require("fs");
const path = require("path");
const ac = require("@antiadmin/anticaptchaofficial");
ac.setAPIKey(
  process.env.ANTI_CAPTCHA_KEY || "15142e9e43076b50f2c78247a94129ca"
);
const scrapeCategory = async (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      const arrayA = [];
      const timestamp = new Date().getTime();
      let page = await browser.newPage();
      console.log(">> Mở tab mới...");

      await page.goto(url);
      const client = await page.target().createCDPSession();
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: path.resolve("./filetax"),
      });
      await page.click(
        "#bodyP > div.khungtong > div.frm_login > div.khungbaolongin > div.left-conten > div > div:nth-child(2) > a"
      );

      await page.waitForTimeout(2000);
      await page.evaluate(() => {
        document
          .querySelector(
            "#bodyP > div > div.banner > div.dangnhap > span:nth-child(2) > button"
          )
          .click();
      });

      await page.waitForSelector("#_userName");
      await page.focus("#_userName");
      await page.type("#_userName", "0315375348-QL");

      await page.waitForSelector("#password");
      await page.focus("#password");
      await page.type("#password", "@Gonext$12");

      const myElement = await page.$(
        "#loginForm > table > tbody > tr:nth-child(4) > td > div > div.hien_mxn"
      );

      const screenshotBuffer = await myElement.screenshot();
      fs.writeFileSync(
        path.resolve(__dirname, `${timestamp}-captcha.png`),
        screenshotBuffer
      );
      const captcha = fs.readFileSync(
        path.resolve(__dirname, `${timestamp}-captcha.png`),
        {
          encoding: "base64",
        }
      );

      let valueCaptcha = null;
      for (let retryIndex = 0; retryIndex < 1000; retryIndex++) {
        try {
          // eslint-disable-next-line no-await-in-loop
          valueCaptcha = await ac.solveImage(captcha, true);

          break;
        } catch (error) {
          // eslint-disable-next-line no-continue
          continue;
        }
      }
      fs.rmSync(path.resolve(__dirname, `${timestamp}-captcha.png`), {
        recursive: true,
      });

      console.log(valueCaptcha);
      await page.waitForSelector("#vcode");
      await page.focus("#vcode");
      await page.type("#vcode", valueCaptcha);

      await page.waitForSelector("#dangnhap");
      await page.evaluate(() => {
        document.querySelector("#dangnhap").click();
      });

      await page.waitForNavigation();

      await page.waitForSelector("#tabmenu > li.li-3 > a");

      await page.click("#tabmenu > li.li-3 > a");

      await page.waitForSelector("#sc3 > ul > li:nth-child(7) > a");

      await page.evaluate(() => {
        document.querySelector("#sc3 > ul > li:nth-child(7) > a").click();
      });

      await page.waitForTimeout(5000);

      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.evaluate(() => {
          document
            .querySelector("#tranFrame")
            .contentWindow.document.body.querySelector(
              "#form_content > div > table > tbody > tr > td:nth-child(2) > div > span > label > span.buttonText"
            )
            .click();
        }),
      ]);
      await fileChooser.accept([
        "C:\\Users\\ACER\\Downloads\\HCM-0315375348-05_KK_TT80-Q22023-L00.xml",
      ]);

      await page.evaluate(() => {
        document
          .querySelector("#tranFrame")
          .contentWindow.document.body.querySelector("#uploadButton")
          .click();
      });

      await page.waitForTimeout(5000);

      resolve();
    } catch (error) {
      console.log("Lỗi ở scrape category: " + error);
      reject(error);
    }
  });

module.exports = {
  scrapeCategory,
};
