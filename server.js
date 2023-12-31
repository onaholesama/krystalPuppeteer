// Import necessary packages
const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');

// Initialize Express app
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Use the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    let location = req.query.location;
    let expression = req.query.expression;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
	
	await page.setViewport({
		width: 512,
		height: 288
	});

    // Puppeteer will visit the URL and render the page.
    await page.goto(`https://myexampleasjdisads.onrender.com/render?location=${location}&expression=${expression}`, {
        waitUntil: 'networkidle0', // Wait until all resources are loaded.
    });

    // Take screenshot of the rendered page.
    const screenshotBuffer = await page.screenshot();

    // Close the headless browser.
    await browser.close();

    // Send back the screenshot as a response.
    res.type('image/png').send(screenshotBuffer);
});

app.get('/render', (req, res) => {
  let location = req.query.location;
  let expression = req.query.expression;

  res.render('index', {location: location, expression: expression});
});

/*
app.get('/', (req, res) => {
    let location = req.query.location;
    let expression = req.query.expression;

    // Render location and expression info to the EJS template:
    res.render('index', {location: location, expression: expression});
});*/

// Listen on port 3000, can be any port
app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
