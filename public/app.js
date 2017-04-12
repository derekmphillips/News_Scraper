var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cheerio = require('cheerio');
var request = require('request');
var logger = require('morgan');

request ('http://www.nytimes.com/', function(err, res, body) {
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