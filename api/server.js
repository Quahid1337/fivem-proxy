import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto('https://servers-frontend.fivem.net/api/servers/single/ajyydz', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    const body = await page.evaluate(() => document.body.innerText);

    const json = JSON.parse(body);
    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
