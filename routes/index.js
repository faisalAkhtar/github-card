var express = require('express');
var router = express.Router();
const https = require('https');
var imageDataURI = require('image-data-uri');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Github card' });
});

/* GET card. */
router.get('/api', function(req, res, next) {
  var username = req.query.username
  if(username=="" || username==null || username == undefined) {
    res.send("Query parameter 'user' missing<br>Please make a request as following /card?user=&lt;your-github-username&gt;")
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
      res.status(200).type('image/svg+xml').render('404 - User not found.ejs', { msg: 'User not found' });
      return
    } else if(resp.statusCode==403) {
      res.status(200).type('image/svg+xml').render('403 - API rate limit exceeded.ejs', { msg: 'API rate limit exceeded' });
      return
    } else if(resp.statusCode!=200) {
      res.status(200).type('image/svg+xml').render('4xx - An unknown error occurred.ejs', { msg: 'An unknown error occurred' });
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
