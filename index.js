const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();


// Generate screenshot
app.get('/screenshot/:url', async (req, res) => {
  const { url } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const screenshot = await page.screenshot();
  await browser.close();
  res.set('Content-Type', 'image/png');
  res.send(screenshot);
});

// Generate PDF
app.get('/pdf/:url', async (req, res) => {
  const { url } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  res.set('Content-Type', 'application/pdf');
  res.send(pdf);
});
// Performance monitoring
app.get('/perform/:url', async (req, res) => {
  const { url } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  await browser.close();
  res.json(performanceTiming);
});

// Debugging
app.get('/debug/:url', async (req, res) => {
  const { url } = req.params;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  // Pause execution and wait for user input
  await page.evaluate(() => { debugger; });
  await browser.close();
  res.send('Debugging complete');
});

app.get('/render', async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Get the HTML content of the page
  let html = await page.content();

  await browser.close();
  res.send(html);
});
app.get('/test', async (req, res) => {
  const { url } = req.query;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close()
  res.set('Content-Type', 'image/png');
  res.send(screenshot);
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
