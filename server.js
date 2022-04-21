var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var QUESTIONS_COLLECTION = "questionsCollection";
var MISSING_QUESTIONS_COLLECTION = "missingQuestionsCollection";


var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://JCongdon:IVUThQCCmnoXUeHe@cluster0-shard-00-00.faa1c.mongodb.net:27017,cluster0-shard-00-01.faa1c.mongodb.net:27017,cluster0-shard-00-02.faa1c.mongodb.net:27017/questions?ssl=true&replicaSet=atlas-b9yuoo-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
  const collection = client.db("questions").collection("questionsCollection");

  // Save database object from the callback for reuse.
  db = client;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port); 
  });
});

// questions API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/questions"
 *    GET: finds all questions
 *    POST: creates a new question
 */

app.get("/questions", function(req, res) {
  var question = req.query.question;

  if (!(question)) {
    handleError(res, "Invalid user input", "Must provide a question and answer.", 400);
    // res.json({});
    
  } else {

   db.collection(QUESTIONS_COLLECTION).find({Question: question}).toArray(function(err, result) {
      if (err) {
        console.log(err.message);
        handleError(res, err.message, "No Answer");
      } else {
        res.status(200).json(result);
      }
    });
  }
});

app.post("/missing", function(req, res) {
  var question = req.query.question;

  if (!(question)) {
    handleError(res, "Invalid user input", "Must provide a question and answer.", 400);
  } else {
    db.collection(MISSING_QUESTIONS_COLLECTION).insertOne({Question: question}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
  }
});

app.get("/missing", function(req, res) {
 db.collection(MISSING_QUESTIONS_COLLECTION).find({}).toArray(function(err, result) {
    if (err) {
      console.log(err.message);
      handleError(res, err.message, "No Answer");
    } else {
      res.status(200).json(result);
    }
  });
});


/*  "/questions/:question"
 *    GET: find question by question
 *    PUT: update question by question
 *    DELETE: deletes question by id
 */

app.delete("/questions/:id", function(req, res) {
});




