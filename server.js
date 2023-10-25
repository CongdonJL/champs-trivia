var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
const fs = require('fs');
var request = require('request');


var qs = require('querystring');

var ObjectID = mongodb.ObjectID;

var QUESTIONS_COLLECTION = "questionsCollection";
var MISSING_QUESTIONS_COLLECTION = "missingQuestionsCollection";

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://JCongdon:IVUThQCCmnoXUeHe@cluster0.faa1c.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("questions").collection("questionsCollection");
  db = collection

  console.log("Database connection ready");

  // Initialize the app
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port); 
  });
});   








/********************
 *   
 *  API ROUTES BELOW
 *
 ********************/

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// app.get("/v2/questions", function(req, res) {
//   res.status(200).json('hello')
// });


/*  "/v2/questions"
 *    GET: find question
 *     
 *      If Question Found - return Answer
 *      If Not Found - return empty array
 */

app.get("/v2/questions", function(req, res) {
  var question = req.query.question;
  
  if (!(question)) {
    handleError(res, "Invalid user input", "Must provide a question.", 400);
  } else {
   db.find({Question: question}).toArray(function(err, result) {
    res.status(200).json(result);
   });
 }
});

/*  "/v2/questions"
 *    POST: Add question
 *     
 *      
 *      Adds Questions to Database
 */



app.post("/v2/questions", function(req, res) {
  var question = req.query.question;
  var answer = req.query.answer;

  console.log(question);

  // if (result.length == 0){
    myobj = {
      "Question": question,
      "Answer": answer,
    };

    try {
      req = db.insertOne(myobj, function(err, result) {
        if (err) {
          throw err;
        }
        console.log("1 document inserted");
        console.log(question);
        // console.log(result);
        res.send('success')
      });
    } catch (e) {
        console.log(e);
        res.send('fail')
    };

  
});


/*  "/questions"
 *    GET: finds all questions - Adds missing Questions 
 *     
 *    To Be depreciated. 
 */

app.get("/questions", function(req, res) {
  var question = req.query.question;
  var ans1 = req.query.ans1;
  var ans2 = req.query.ans2;
  var ans3 = req.query.ans3;
  var ans4 = req.query.ans4;


  if (!(question)) {
    handleError(res, "Invalid user input", "Must provide a question and answer.", 400);
  } else {
   db.find({Question: question}).toArray(function(err, result) {
      if (err) {
      } else {
        if (result.length == 0){
            myobj = {
              "Question": question,
              "Answer1": ans1,
              "Answer2": ans2,
              "Answer3": ans3,
              "Answer4": ans4,
              "Flag": "Missing"
            };

            db.insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
        }
        res.status(200).json(result);
      }
    });
  }
});

/*  "/missing"
 *    GET: finds all missingquestions 
 *     
 *    To Be depreciated. 
 */

app.get("/missing", function(req, res) {
     db.find({Flag: "Missing"}).toArray(function(err, result) {
        if (err) {
        } else {
          res.status(200).json(result);
        }
      });

    res.status(200);

});





 /*  "/user"
 *    GET: Checks User Authentication
 *     
 *    To Be Moved to new collection. 
 */
app.get("/user", function(req, res) { 
  // print('here');
      var username = req.query.username;
      try {
        db.find({user: username}).toArray(function(err, result) {
          if (err) {
          } else {
            if (result.length == 0){
            myobj = {
              "user": username,
              "approved": null,
            };

            db.insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
        }
        console.log(username);
        res.status(200).json(result);
          }
        });
      } catch (e) {
        console.log(e); 
      }
      
});

 /*  "/user"
 *    GET: Checks User Authentication
 *     
 *    To Be Moved to new collection. 
 */
app.post("/user", function(req, res) { 
      var username = req.query.username;
      try {
         if (result.length == 0){
            myobj = {
              "user": username,
              "approved": true,
            };

            db.insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });

          }

      } catch (e) {
        console.log(e); 
      }
      
});

  