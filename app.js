/**
 * Module dependencies.
 */

// come with NodeJS
const path = require('path');
const fs = require('fs');

// installed
const express = require('express');
const cookieParser = require('cookie-parser');
const slash   = require('express-slash'); // for strict redirects with slashes in urls
const compression = require('compression'); // compress response bodies for all request that traverse through the middleware
const errorHandler = require('errorhandler');

/**
 * Controllers (route handlers).
 */
const spotifyController = require(path.join(__dirname, 'back/api/spotify.js'));
const pagesController = require(path.join(__dirname, 'back/controllers/index.js'));

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);

// set views (html)
app.set('views', [
    path.join(__dirname, 'views')
]);
app.use(compression());
app.set('view engine', 'pug');

// set routing
app.enable('strict routing');
const router = express.Router({
    caseSensitive	: app.get('case sensitive routing'),
    strict			: app.get('strict routing')
});
app.use(router);
app.use(slash());

// static files (styles, scripts)
app.use('/assets', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * App routes.
 */

// CDBattaglia
router.get('/', pagesController.index);

// API
router.get('/api/spotify/recents', spotifyController.recentTracks, spotifyController.searchSpotify);

/**
 * 500 Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
