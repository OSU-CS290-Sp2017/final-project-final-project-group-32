/*
 * Name: Alexander Smith
 * User: smithal5
 */
var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var db;
// Connect to the db
MongoClient.connect("mongodb://localhost:27017/nbaOffseason", function(err, database) {
  db = database;
  if(!err) {
    console.log("We are connected");
  }
});

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.get('/', function(req,res,next) {
  var templateArgs = {
    title:'Offseason Fantasy Tool'
  }
  res.status(200).render('leagueOverview', templateArgs);
});

app.get('/teams', function(req,res,next) {
  db.collection('teams').find({conference: "western"}).toArray(function(err, wTeamInfo) {
    if(err) {
      res.status(500).send("Error fetching teams from DB");
    } else {
      db.collection('teams').find({conference: "eastern"}).toArray(function(err, eTeamInfo) {
        if(err) {
          res.status(500).send("Error fetching teams from DB");
        } else {
          var templateArgs = {
            title: 'NBA Teams',
            wteam: wTeamInfo,
            eteam: eTeamInfo
          };
          res.status(200).render('teams', templateArgs);
        }
      });
    }
  });
});

app.get('/mock-draft', function(req,res,next) {
  var templateArgs = {
    title:'Mock Draft'
  }
  res.status(200).render('mock-draft', templateArgs);
});

app.get('/teams/:teamname', function(req,res,next) {
  console.log("==url params for req:",req.params);
	var team = req.params.teamname;
  var totalSalary = 0;
  var i = 0;
  db.collection('teams').find({abrv: team}).toArray(function(err, teamInfo) {
    if(err) {
      res.status(500).send("Error fetching team info from DB");
    } else {
      db.collection('players').find({teamname: teamInfo[0].teamname}).toArray(function(err, playerInfo) {
        if(err) {
          res.status(500).send("Error fetching player info from DB");
        } else {
          var templateArgs = {
            title: teamInfo[0].teamname,
            players: playerInfo,
            total: teamInfo[0].salary
          };
          res.status(200).render('teamPage', templateArgs);
        }
      });
    }
  });
});

app.post('/teams/:teamName/updateSalary', function(req,res,next) {
  var name = req.params.teamName;
  db.collection('teams').updateOne(
    {teamname: name},
    {$set: {"salary": req.body.salary},
    $currentDate: {lastModified: true}},
    function (err, result) {
      if(err) {
        res.status(500).send("Error");
      } else {
        res.status(200).send();
      }
    }
  )
});

app.post('/players/:playerNameUrl/updateSalary', function(req,res,next) {
  var name = req.body.name;
  db.collection('players').updateOne(
    {playername: name},
    {$set: {"salary18": req.body.salary},
    $currentDate: {lastModified: true}},
    function (err, result) {
      if(err) {
        res.status(500).send("Error");
      } else {
        res.status(200).send();
      }
    }
  )
});

app.post('/players/:playerName/updateTeam', function(req,res,next) {
  var name = req.body.name;
  var team = req.body.team;
  db.collection('players').updateOne(
    {playername: name},
    {$set: {"teamname": team},
    $currentDate: {lastModified: true}},
    function (err, result) {
      if(err) {
        res.status(500).send("Error");
      } else {
        res.status(200).send();
      }
    }
  )
});

app.post('/players/:playerName/addPlayerSalary', function(req,res,next) {
  var name = req.body.name;
  var total = 0;
  db.collection('players').find({playername: name}).toArray(function(err, playerInfo) {
    if(err) {
      res.status(500).send("Error");
    } else {
      db.collection('teams').find({teamname: playerInfo[0].teamname}).toArray(function(err, teamInfo) {
        if(err) {
          res.status(500).send("Error");
        } else {
          total = teamInfo[0].salary + playerInfo[0].salary18;
          db.collection('teams').updateOne(
            {teamname: teamInfo[0].teamname},
            {$set: {"salary": total},
            $currentDate: {lastModified: true}},
            function (err, result) {
              if(err) {
                res.status(500).send("Error");
              } else {
                res.status(200).send();
              }
            }
          )
        }
      });
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res) {
  res.status(404).render('404Page');
});

app.listen(port, function () {
  console.log("== Server listening on port", port);
});
