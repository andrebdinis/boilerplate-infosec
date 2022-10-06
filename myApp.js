const express = require('express');
//CONSOLE: npm install helmet --save
//JS: import helmet from 'helmet';
//JS: import * as helmet from 'helmet';
const helmet = require('helmet');

const app = express();

//Hide Potentially Dangerous Information Using helmet.hidePoweredBy()
//middleware to remove the X-Powered-By header
app.use(helmet.hidePoweredBy());

//Mitigate the Risk of Clickjacking with helmet.frameguard()
//middleware sets the X-Frame-Options header. It restricts who can put your site in a frame. It has three modes: DENY, SAMEORIGIN, and ALLOW-FROM.
app.use(helmet.frameguard({ action: 'deny' }));

//Mitigate the Risk of Cross Site Scripting (XSS) Attacks with helmet.xssFilter()
//The basic rule to lower the risk of an XSS attack is simple: “Never trust user’s input”.
app.use(helmet.xssFilter())

//Avoid Inferring the Response MIME Type with helmet.noSniff()
//middleware sets the X-Content-Type-Options header to nosniff, instructing the browser to not bypass the provided Content-Type
app.use(helmet.noSniff())

//Prevent IE from Opening Untrusted HTML with helmet.ieNoOpen()
//middleware sets the X-Download-Options header to noopen. This will prevent IE users from executing downloads in the trusted site’s context.
app.use(helmet.ieNoOpen())

//Ask Browsers to Access Your Site via HTTPS Only with helmet.hsts()
//By setting the header Strict-Transport-Security, you tell the browsers to use HTTPS for the future requests in a specified amount of time.
ninetyDaysInSeconds = 90*24*60*60
app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds, force: true }))

//Disable DNS Prefetching with helmet.dnsPrefetchControl()
//To improve performance, most browsers prefetch DNS records for the links in a page. In that way the destination ip is already known when the user clicks on a link. If you have high security needs you can disable DNS prefetching, at the cost of a performance penalty.
app.use(helmet.dnsPrefetchControl())

//Disable Client-Side Caching with helmet.noCache()
//If you are releasing an update for your website, and you want the users to always download the newer version, you can (try to) disable caching on client’s browser. It can be useful in development too. Caching has performance benefits, which you will lose, so only use this option when there is a real need.
app.use(helmet.noCache())

//Set a Content Security Policy with helmet.contentSecurityPolicy()
//Protects your app from XSS vulnerabilities, undesired tracking, malicious frames, and much more. CSP works by defining an allowed list of content sources which are trusted. By default, directives (HTML 5 Rocks, KeyCDN) are wide open, so it’s important to set the defaultSrc directive as a fallback.
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      //"default-src": 
      scriptSrc: ["'self'", 'trusted-cdn.com']
      //"script-src": 
    },
  })
);



//Configure Helmet Using the ‘parent’ helmet() Middleware
//app.use(helmet()) will automatically include all the middleware introduced above, except noCache(), and contentSecurityPolicy(), but these can be enabled if necessary. You can also disable or configure any other middleware individually, using a configuration object.
//app.use(helmet());
app.use(helmet({
  frameguard: {                // configure
    action: 'deny'
  },
  hsts: {
    maxAge: ninetyDaysInSeconds,
    force: true,
  },
  noCache: true,              // enable
  contentSecurityPolicy: {    // enable and configure
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com'],
    },
  }
}));


































module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
