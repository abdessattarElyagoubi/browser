const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();


// Generate screenshot
app.get('/screenshot/:url', async (req, res) => {
  const { url } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url).catch((err) => {
  console.log('Failed to load webpage:', err);
  const screenshot = await page.screenshot({ "quality": 100, "type":"png", "fullpage":true});
  await browser.close();
  res.set('Content-Type', 'image/png');
  res.send(screenshot);
});

// Generate PDF
app.get('/pdf/:url', async (req, res) => {
  const { url } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url).catch((err) => {
  console.log('Failed to load webpage:', err);
  const pdf = await page.pdf({ format: 'A4', "fullpage":true });
  await browser.close();
  res.set('Content-Type', 'application/pdf');
  res.send(pdf);
});
// Performance monitoring
app.get('/perform/:url', async (req, res) => {
  const { url } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url).catch((err) => {
  console.log('Failed to load webpage:', err);
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
  await page.goto(url).catch((err) => {
  console.log('Failed to load webpage:', err);
  // Pause execution and wait for user input
  await page.evaluate(() => { debugger; });
  await browser.close();
  res.send('Debugging complete');
});

app.get('/render', async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' }).catch((err) => {
  console.log('Failed to load webpage:', err);

  // Get the HTML content of the page
  let html = await page.content();

  await browser.close();
  res.send(html);
});
app.get('/test', async (req, res) => {
  const url = 'https://google.com';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url).catch((err) => {
  console.log('Failed to load webpage:', err);
});
  const screenshot = await page.screenshot({ "quality": 100, "type":"png", "fullpage":true});
  await browser.close()
  res.set('Content-Type', 'image/png');
  res.send(screenshot);
});
app.get('/screen', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://m.fusionbrain.ai', { waitUntil: 'networkidle0' }).catch((err) => {
  console.log('Failed to load webpage:', err);
});
  await page.waitForNavigation();

  await page.type('#username', 'droiders@outlook.com');
  await page.type('#password', 'Simou2007');
  await page.click('#kc-login');
  await page.waitForNavigation();

  const screenshot = await page.screenshot({ type: 'png' });
  res.set('Content-Type', 'image/png');
  res.send(screenshot);

  await browser.close();
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
