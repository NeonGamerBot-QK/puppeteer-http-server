const express = require('express');
const app = express();

const PuppeteerHTTPServer = require('./index');
const puppeteerHTTPServer = new PuppeteerHTTPServer({ puppeteer: { headless: false }});

app.use(puppeteerHTTPServer.middlewareFunction());

app.get('/', async (req, res) => {
    await req.page.goto('https://www.google.com');
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send('Hello World! +' + await req.page.url());
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});