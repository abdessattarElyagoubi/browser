const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();

// Apply CORS to specific URLs while excluding modified URLs
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from all origins except the modified URLs
    if (!origin || origin.startsWith('https://browser-o8r6.onrender.com/render?url=')) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  },
  optionsSuccessStatus: 200
}));

app.get('/render', async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Get the base URL of the website
  const baseURL = new URL(url).origin;

  // Get the HTML content of the page
  let html = await page.content();

  // Parse the HTML content and modify all URLs and relative URLs to include the base URL
  const el = new DOMParser().parseFromString(html, 'text/html');
  const elements = el.querySelectorAll('[src],[href]');
  elements.forEach((element) => {
    const url = element.getAttribute('src') || element.getAttribute('href');
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      if (element.hasAttribute('src')) {
        element.setAttribute('src', new URL(url, baseURL).href);
      }
      if (element.hasAttribute('href')) {
        element.setAttribute('href', new URL(url, baseURL).href);
      }
    }
  });

  // Get the modified HTML code
  html = el.documentElement.outerHTML;

  await browser.close();
  res.send(html);
});

app.post('/data', (req, res) => {
  // Handle the data
  res.send('Data received');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
