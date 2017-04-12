var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var cheerio = require('cheerio');
var request = require('request');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public/'));

var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["news"];

var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});



app.get('/', function(req, res) {
  res.send(index.html);
});

request ('http://www.reddit.com/', function(err, res, body) {
  var  $ = cheerio.load(body);
  var results = [];

  $('.title').each(function(i, element) {
    var title = $(this).find('a').text();
    var link = $(this).find('a').attr('href');
    console.log(title);
    
    results.push({
      title: title,
      url: link
    });
  });
  console.log(results);

});

app.post('/submit', function(req, res) {

  var newsUpdate = req.body;

  newsUpdate.read = false;

  db.news.insert(newsUpdate, function(err, saved) {
    
    if (err) {
      console.log(err);
    } 
 
    else {
      res.send(saved);
    }
  });
});


app.get('/read', function(req, res) {
 
  db.news.find({'read':true}, function(err, found) {
    
    if (err) {
      console.log(err);
    } 

    else {
      res.json(found);
    }
  });
});

app.get('/unread', function(req, res) {

  db.news.find({'read':false}, function(err, found) {
    
    if (err) {
      console.log(err);
    } 
    
    else {
      res.json(found);
    }
  });
});

app.get('/markread/:id', function(req, res) {

  db.news.update({
    '_id': mongojs.ObjectId(req.params.id)
  }, {

    $set: {
      'read':true
    }
  }, 
 
  function(err, edited) {

    if (err) {
      console.log(err);
      res.send(err);
    } 
  
    else {
      console.log(edited);
      res.send(edited);
    }
  });
});

app.get('/markunread/:id', function(req, res) {
 
  db.news.update({
    '_id': mongojs.ObjectId(req.params.id)
  }, {
  
    $set: {
      'read':false
    }
  }, 

  function(err, edited) {
    
    if (err) {
      console.log(err);
      res.send(err);
    } 
  
    else {
      console.log(edited);
      res.send(edited);
    }
  });
});


app.listen(3000, function() {
  console.log('App running on port 3000!');
});
