const request = require('request');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require('async');
const config = require(path.join(__dirname, '../config/config.js'));

/**
 * GET /api/spotify/playlist/recent
 * Home page.
 */

exports.recentTracks = function(req, res, next) {

    let options = {
        method: 'GET',
        url: 'http://ws.audioscrobbler.com/2.0/',
        qs: {
            method: 'user.getrecenttracks',
            user: req.query.user,
            api_key: config.lastfm.apiKey,
            format: 'json'
        }
    };

    request(options, function (error, response, body) {

        if (error || !JSON.parse(body).recenttracks) {
            next(error);
        } else {
            req.lastfm = { recent: JSON.parse(body).recenttracks.track };
            next()
        }
    });
};

exports.searchSpotify = function(req, res) {

    let recents = 'spotify:trackset:FreshSqueezedJuice:';
    let requests = [];

    console.log(req.query.user);
    console.log(req.lastfm.recent);

    _.each(req.lastfm.recent, (track) => {

        let options = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: track.name + ' artist:' + track.artist['#text'],
                type: 'track',
                limit: '1'
            }
        };

        requests.push((callback) => {
            request(options, function (error, response, body) {

                console.log(JSON.parse(body));

                let temp = "";
                if (error) console.log({error: error});
                else {
                    if (body) {
                        if (JSON.parse(body).tracks) {
                            let items = JSON.parse(body).tracks.items;
                            if (items.length != 0) {
                                temp = items[0].uri.split(':')[2]
                            }
                        }
                    }
                }
                callback(error, temp);
            });
        });
    });

    async.parallel(requests, (error, results) => {
        if (error) console.log({error: error});

        console.log(req.query.user);
        console.log(results);

        let trackHashes = [];

        _.each(results, (track) => {
            if (track != "" && track != null) trackHashes.push(track);
        });

        res.status(200).json({ 'message': 'Success!', 'recents': recents + trackHashes.join(',') });
    });
};
