var express = require('express');
var router = express.Router();
const https = require('https');
var imageDataURI = require('image-data-uri');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET card. */
router.get('/card', function(req, res, next) {
  var username = req.query.user
  if(username=="" || username==null || username == undefined) {
    res.send("There was a problem with your request")
    return
  }

  var options = {
    host: 'api.github.com',
    port: 443,
    path: '/users/' + username,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': username
    }
  }
  var post_req = https.request(options, (resp) => {
    console.log('\n---------------\nstatusCode:', resp.statusCode);

    if(resp.statusCode==404) {
      res.send(username + " not found!")
      return
    }

    var data = ''
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk
    });

    // A chunk of data has been recieved.
    resp.on('end', () => {
      data = JSON.parse(data)
      imageDataURI.encodeFromURL(data.avatar_url)
      .then((img) => {
        res.status(200).type('image/svg+xml').render('card', {
          bio: data.bio,
          location: data.location,
          name: data.name,
          avatar: img,
          followers: data.followers,
          repos: data.public_repos,
          id: data.id,
          github: data.login,
          twitter: data.twitter_username,
          blog: data.blog
        });
      })

    })
  })
  post_req.end();
});

module.exports = router;
