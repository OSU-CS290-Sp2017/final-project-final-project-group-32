/*
 * Name: Alexander Smith
 * User: smithal5
 */

var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req,res,next) {
  var templateArgs = {
    title:'Offseason Fantasy Tool'
  }
  res.status(200).render('leagueOverview', templateArgs);
});

app.get('/teams', function(req,res,next) {
  var templateArgs = {
    title:'NBA Teams'
  }
  res.status(200).render('teams', templateArgs);
});

app.get('/mock-draft', function(req,res,next) {
  var templateArgs = {
    title:'Mock Draft'
  }
  res.status(200).render('mock-draft', templateArgs);
});

app.get('/make-trades', function(req,res,next) {
  var templateArgs = {
    title:'Make Trades'
  }
  res.status(200).render('make-trades', templateArgs);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res) {
  res.status(404).render('404Page');
});

app.listen(port, function () {
  console.log("== Server listening on port", port);
});
