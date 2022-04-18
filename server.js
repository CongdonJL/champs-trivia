var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var QUESTIONS_COLLECTION = "questions";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
var MONGODB_URI = "mongodb+srv://JCongdon:IVUThQCCmnoXUeHe@cluster0.faa1c.mongodb.net/qustions?retryWrites=true&w=majority;"

// Connect to the database before starting the application server.
Mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

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
});

app.post("/questions", function(req, res) {
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