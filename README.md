#TrumpBern

The TrumpBern app queries for the top 100 [Bernie Sanders](https://twitter.com/BernieSanders) and [Donald Trump](https://twitter.com/realDonaldTrump) tweets
and combines a random tweet from each of them

##Instructions

Requires [node](http://nodejs.org/) and [npm](http://npmjs.org/) (installing node installs npm too). You also need a Twitter App access token, consumer key, and associated secrets. [You can get those here](https://dev.twitter.com/apps/new). You'll probably also want a fresh twitter account for your bot, though you could have it post to one you already own, too (no but seriously I did that and had some explaining to do, I was naive when I cloned [LatourSwag](https://github.com/dariusk/latourswag))!

Clone the repo, then in your project directory, install the dependencies:

`$ npm install`



Next, edit `config.js` to include your Twitter App access token, consumer key, and associated secrets. This is important! Without this you'll be unable to tweet.
`
module.exports = {
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  ''
}
`


`$ npm start`

Enjoy!
