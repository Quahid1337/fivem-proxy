import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://servers-frontend.fivem.net/api/servers/single/ajyydz', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  const body = await page.evaluate(() => document.body.innerText);

  try {
    const json = JSON.parse(body);
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: "Failed to parse JSON", raw: body });
  }

  await browser.close();
}