// controls twitter for @h1Queriesand

'use strict';

var express       = require('express');
var bodyParser    = require('body-parser'); // parses body data from http POST
var Twit          = require('twit');
var ent           = require('ent');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/tweet', function (req, res) {
    makeSwag(res);
});

var handleOne = 'realDonaldTrump',
        handleTwo = 'BernieSanders';

app.post('/handles', function (req, res) {
    console.log(req.body);
    handleOne = req.body.handleOne;
    handleTwo = req.body.handleTwo;
    res.send();
});

app.use(express.static('app'));


// Our twitter developer API info is in a file called 'config.js'
var T = new Twit(require('./config.js'));

function makeSwag(res) {
    // set up our two data sources (you can paste these in your browser to see the results, in JSON format)
    // URI for all recent #h1Query tweets with 'and' in them
    var h1Query = {q: "from:" + handleOne, count: 100, result_type: "recent"};
    // URI for all recent @h2Querybot tweets
    var h2Query = {q: "from:" + handleTwo, count: 100, result_type: "recent"};
    var h1Queries = [];
    var h2Queries = [];
    var pre = "";
    var post = "";
    var tweet = "";

    // get the h1Query tweets
    T.get('search/tweets', h1Query, function(err, data) {
        // Stop if we receive an error instead of dearch results
        if (err) throw err
        // jettison the metadata, we just care about the results of the search
        var results = data.statuses;
        // look at each result and push it to an array called 'h1Queries' if it is not an RT and ' and ' appears
        // more than 20 characters into the tweet
        for (var i = 0; i < results.length; i++) {
            var text = results[i].text;
            if (
                text.indexOf(' and ') !== -1 &&
                text.indexOf('RT') == -1 &&
                text.indexOf(' and ') > 20
            ) {
                h1Queries.push(text);
            }
        }
        console.log('# h1Queries: ' + h1Queries.length);
        // get the h2Query tweets
        T.get('search/tweets', h2Query, function(err, data) {
            if(err) throw err;
            var results = data.statuses;
            // for each h2Query tweet, find the ones with ' and ' or a comma, and then only if the and or the comma
            // appear somewhat in the middle (30-90 characters). push those to the h2Queries array.
            for (var i = 0; i < results.length; i++) {
                var text = results[i].text;

                if (
                    text.indexOf(' and ') !== -1 ||
                    text.indexOf(', ') !== -1
                ) {
                    if (
                        (text.indexOf(' and ') < 90 && text.indexOf(' and ') > 30) ||
                        (text.indexOf(', ') < 90 && text.indexOf(', ') > 30)
                    ) {
                        h2Queries.push(text);
                    }
                }
            }
            console.log('#h2Queries: ' + h2Queries.length);

            // OKAY now we have 'h1Queries', an array containing a subset of h1Query tweets with 'and' in them,
            // and 'h2Queries', an array containing a subset of h2Query tweets with 'and' or ','

            console.log(h2Queries.length);


            // now we randomize whether tweet takes the form h2Query-and-h1Query    or h1Query-and-h2Query
            var h2Queryfirst = true;
            var text = "";
            if (Math.random() < 0.5) {
                h2Queryfirst = false;
            }

            // here we either pick a random h2Query or a random h1Query to start the tweet with
            if (h2Queryfirst) {
                text = h2Queries[Math.floor(Math.random() * h2Queries.length)];
            }
            else {
                text = h1Queries[Math.floor(Math.random() * h1Queries.length)];
            }

            // by definition this will either have 'and' or a comma, so we grab all the text up to but not including
            // the conjunction. 'and' takes precedence because it allows for more natural sounding results
            // we call it 'pre' because it's the prefix

            if(!text) {
                pre = 'Milk and cookies and ';
            }
            else if (text.indexOf(' and ') !== -1) {
                pre = text.substr(0, text.indexOf(' and '));
            }
            else if (text.indexOf(', ') !== -1) {
                pre = text.substr(0, text.indexOf(', '));
            }

            // now we pick a random h2Query or a random h1Query for end of our tweet
            if (h2Queryfirst) {
                text = h1Queries[Math.floor(Math.random() * h1Queries.length)];
            }
            else {
                text = h2Queries[Math.floor(Math.random() * h2Queries.length)];
            }

            // this time we extract the second half of the source tweet and put it in 'post'
            if (!text) {
                post = ' and milk and cookies';
            }
            else if (text.indexOf(' and ') !== -1) {
                post = text.substr(text.indexOf(' and ') + 5, 140);
            }
            else if (text.indexOf(', ') !== -1) {
                post = text.substr(text.indexOf(', ') + 2, 140);
            }

            // our tweet is joined on an " and " -- every @h2Queryh1Query tweet has the word "and" in it!
            tweet = pre + " and " + post;
            // strip out URLs and usernames
            tweet = tweet.replace(/(https?:\/\/[^\s]+)/g, '');
            tweet = tweet.replace(/@[a-zA-Z0-9_]+/g, '');
            // decode any escaped characters so that '&lt;' will show as '<', etc
            tweet = ent.decode(tweet);
            // truncate to 140 chars so twitter doesn't reject it (most tweets are < 140 but some aren't)
            tweet = tweet.substr(0, 140);

            // TODO: don't tweet for now, but sometday
            T.post('statuses/update', {
                status: tweet
            }, function (err, reply) {});

            res.send(tweet);
        });
    });
}

app.listen(3000);
console.log('twittermash is running');

// Tweet once when we start up the bot

// Tweet every 15 minutes
setInterval(function () {
    try {
        makeSwag();
    }
    catch (e) {
        console.log(e);
    }
}, 1000 * 60 * 15);
