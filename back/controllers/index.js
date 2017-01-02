/**
 * GET /
 * Home page.
 */


exports.index = function(req, res) {
    res.render('index', {
        path: req.path,
        title: 'Spotify/LastFM Recents'
    });
};
