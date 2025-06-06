import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

app.get('/api/server', async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto('https://servers-frontend.fivem.net/api/servers/single/ajyydz', {
      waitUntil: 'networkidle0',
      timeout: 60000
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
