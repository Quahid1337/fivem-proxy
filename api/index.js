import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

const app = express();

app.get('/api/server', async (req, res) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://servers-frontend.fivem.net/api/servers/single/ajyydz', {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    const body = await page.evaluate(() => document.body.innerText);
    const json = JSON.parse(body);
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  } finally {
    if (browser) await browser.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
