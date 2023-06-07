const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/render', async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Get the base URL of the website
  const baseURL = new URL(url).origin;

  // Modify the URLs of all resources fetched by Puppeteer to include the base URL
  await page.$$eval('link[rel="stylesheet"], img, script[src]', (elements, baseURL) => {
    elements.forEach((element) => {
      const url = new URL(element.src || element.href, baseURL).href;
      element.src = url;
      element.href = url;
    });
  }, baseURL);

  const content = await page.content();
  await browser.close();
  res.send(content);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
