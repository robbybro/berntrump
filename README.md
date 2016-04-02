#Twitter Mash

Twitter Mash takes combines random tweets from the two twitter handles that you specify and spits out the aggregated results. You can even retweet the ones you like! This project is based on a twitter bot I wrote that combined Bernie Sanders and Donald Trump tweets, which in turn was based on a twitter bot that combined Latour quotes with tweets that included #swag](https://github.com/dariusk/latourswag).

##Instructions

Requires [node](http://nodejs.org/) and [npm](http://npmjs.org/) (installing node installs npm too). You also need a Twitter App access token, consumer key, and associated secrets. [You can get those here](https://dev.twitter.com/apps/new). 

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
