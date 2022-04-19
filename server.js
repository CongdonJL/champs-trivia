var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var QUESTIONS_COLLECTION = "questionsCollection";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
// var MONGODB_URI = "mongodb+srv://JCongdon:IVUThQCCmnoXUeHe@cluster0.faa1c.mongodb.net/questions?retryWrites=true&w=majority";

// Connect to the database before starting the application server.
// mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }


var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://JCongdon:IVUThQCCmnoXUeHe@cluster0-shard-00-00.faa1c.mongodb.net:27017,cluster0-shard-00-01.faa1c.mongodb.net:27017,cluster0-shard-00-02.faa1c.mongodb.net:27017/questions?ssl=true&replicaSet=atlas-b9yuoo-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
  const collection = client.db("questions").collection("questionsCollection");
  // perform actions on the collection object
  // client.close();

  // Save database object from the callback for reuse.
  db = database;
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
  db.collection(QUESTIONS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message);
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/questions", function(req, res) {
  var newQuestion = req.body;
  newQuestion.createDate = new Date();

  if (!(req.body.question && req.body.answer)) {
    handleError(res, "Invalid user input", "Must provide a question and answer.", 400);
  }

  db.collection(QUESTIONS_COLLECTION).insertOne(newQuestion, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new Question.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/questions/:question"
 *    GET: find question by question
 *    PUT: update question by question
 *    DELETE: deletes question by id
 */

app.get("/questions/:question", function(req, res) {
});

app.put("/questions/:question", function(req, res) {
});

app.delete("/questions/:id", function(req, res) {
});




