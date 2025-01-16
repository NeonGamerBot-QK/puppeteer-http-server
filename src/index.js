const puppeteer  = require('puppeteer');
const debug = require('debug')('puppeteer-http-server');
//exporting as a middleware class thing
module.exports = class PuppeteerHTTPServer {
    constructor(options = {
        preserve_pages: false,
        dont_init: false,
        puppeteer: null
    }) {
        this.options = options;
        if(!this.options.dont_init) {
            this.init();
        }
    }
    async init() {
        debug("Initializing");
        this.browser = await puppeteer.launch(this.options.puppeteer || {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
     middlewareFunction() {
        debug("Middleware function setup");
        return async (req, res, next) => {
debug("#middlewareFunction [request] > ")
        res.on('finish', () => {
            debug("#middlewareFunction [request] > [finish] ")
            this.cleanupMiddleware(req,res);
        })
        res.on('close', async () => {
            debug("#middlewareFunction [request] > [close] ")
            // wait a little bit for the express route 
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.cleanupMiddleware(req,res);
        })
        req.page = await this.browser.newPage();
        next();
    }
    }
    async cleanupMiddleware(req,res) {
        debug("Cleaning up");
        if(req.page && !this.options.preserve_pages) {
        try {
            await req.page.close().catch(debug)
            delete req.page;
        } catch(e) {
            debug("Error cleaning up middleware");
            debug(e)
        }
        }
    }
}