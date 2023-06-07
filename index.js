const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/render', async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const content = await page.content();
  await browser.close();
  res.send(content);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
