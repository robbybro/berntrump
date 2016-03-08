// controls twitter for @trumpsand

'use strict';

var express     = require('express');
var bodyParser  = require('body-parser'); // parses body data from http POST
var Twit        = require('twit');
var ent         = require('ent');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/tweet', function (req, res) {
  makeSwag(res);
});

app.use(express.static('app'));


// Our twitter developer API info is in a file called 'config.js'
var T = new Twit(require('./config.js'));

function makeSwag(res) {
  // set up our two data sources (you can paste these in your browser to see the results, in JSON format)
  // URI for all recent #trump tweets with 'and' in them
  var trump = {q: "from:realDonaldTrump", count: 100, result_type: "recent"}; 
  // URI for all recent @berniebot tweets
  var bernie = {q: "from:BernieSanders", count: 100, result_type: "recent"};
  var trumps = [];
  var bernies = [];
  var pre = "";
  var post = "";
  var tweet = "";

  // get the trump tweets 
  T.get('search/tweets', trump, function(err, data) {
    // Stop if we receive an error instead of search results
    if (err) throw err
    // jettison the metadata, we just care about the results of the search
    var results = data.statuses;
    // look at each result and push it to an array called 'trumps' if it is not an RT and ' and ' appears
    // more than 20 characters into the tweet
    for (var i = 0; i < results.length; i++) {
      var text = results[i].text;
      if (
        text.indexOf(' and ') !== -1 &&
        text.indexOf('RT') == -1 &&
        text.indexOf(' and ') > 20
      ) {
        trumps.push(text);
      }
    }
    console.log('# trumps: ' + trumps.length);
    // get the bernie tweets
    T.get('search/tweets', bernie, function(err, data) {
      if(err) throw err;
      var results = data.statuses;
      // for each bernie tweet, find the ones with ' and ' or a comma, and then only if the and or the comma
      // appear somewhat in the middle (30-90 characters). push those to the bernies array.
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
            bernies.push(text);
          }
        }
      }
      console.log('#bernies: ' + bernies.length);

      // OKAY now we have 'trumps', an array containing a subset of trump tweets with 'and' in them,
      // and 'bernies', an array containing a subset of bernie tweets with 'and' or ','

      console.log(bernies.length);


      // now we randomize whether tweet takes the form bernie-and-trump  or trump-and-bernie
      var berniefirst = true;
      var text = "";
      if (Math.random() < 0.5) {
        berniefirst = false;
      }

      // here we either pick a random bernie or a random trump to start the tweet with
      if (berniefirst) {
        text = bernies[Math.floor(Math.random() * bernies.length)];
      }
      else {
        text = trumps[Math.floor(Math.random() * trumps.length)];
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

      // now we pick a random bernie or a random trump for end of our tweet
      if (berniefirst) {
        text = trumps[Math.floor(Math.random() * trumps.length)];
      }
      else {
        text = bernies[Math.floor(Math.random() * bernies.length)];
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

      // our tweet is joined on an " and " -- every @bernietrump tweet has the word "and" in it!
      tweet = pre + " and " + post;
      // strip out URLs and usernames
      tweet = tweet.replace(/(https?:\/\/[^\s]+)/g, '');
      tweet = tweet.replace(/@[a-zA-Z0-9_]+/g, '');
      // decode any escaped characters so that '&lt;' will show as '<', etc
      tweet = ent.decode(tweet);
      // truncate to 140 chars so twitter doesn't reject it (most tweets are < 140 but some aren't)
      tweet = tweet.substr(0, 140);

      // TODO: don't tweet for now, but sometday
      // T.post('statuses/update', {
      //   status: tweet
      // }, function (err, reply) {});

      res.send(tweet);
    });
  });
}

app.listen(3000);
console.log('twittermash is running');

// Tweet once when we start up the bot

// Tweet every 15 minutes
// setInterval(function () {
//   try {
//     makeSwag();
//   }
//   catch (e) {
//     console.log(e);
//   }
// }, 1000 * 60 * 15);
