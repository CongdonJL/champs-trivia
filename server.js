var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
const fs = require('fs');
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
  } else {
   db.collection(QUESTIONS_COLLECTION).find({Question: question}).toArray(function(err, result) {
      if (err) {
      } else {
        res.status(200).json(result);
      }
    });
  }
});

app.put("update", function(req, res) {
  var question = req.query.question;
  var answer = req.query.answer;

  

  return [];
})

//sheamus and cesaro
//count out

app.get("/missing", function(req, res) {
    var answerToFind = 'Jinder';
    var answerToReplace = 'Jinder Mahal';
    
    db.collection(QUESTIONS_COLLECTION).updateMany({Answer: answerToFind},{$set:{Answer:answerToReplace}});
    res.status(200);




  //   db.collection(QUESTIONS_COLLECTION).find({Answer: answerToFind}).toArray(function(err, result) {
  //   if (err) {
  //     handleError(res, err.message, "Failed to create new contact.");
  //   } else {
  //     for(var key in result) {
  //       result[key].Answer = answerToReplace;
  //     }
  //     db.collection(QUESTIONS_COLLECTION).find({Answer: answerToFind}).toArray(function(err, result) {

  //     }
  //     res.status(200).json(result);
  //   }
  // });
});


app.get("/missingQuestion", function(req, res) {
    //What tag team moved from Raw to SmackDown during the 2021 WWE Draft?
    var questionToFind = "What tag team moved from Raw to SmackDown during the 2021 WWE Draft?";
    var questionToReplace = 'The Viking Raiders';
    
    db.collection(QUESTIONS_COLLECTION).updateMany({Question: questionToFind},{$set:{Answer:questionToReplace}}, function(err,r){
          if (err) {
            reject(err); 
          }else{
            resolve(r);
          } 
    });

});

app.get("/imageUpdate", function(req, res) {
  // print('here');
      var image = req.query.image;
      console.log(image);
      try {
        db.collection(QUESTIONS_COLLECTION).insertOne({Question: image, flag: "true"});
        // .then(response => response.json());
      } catch (e) {
        print(e);
        console.log(e);
        console.log(image);
      }
      
});

app.post("/imageUpdate", function(req, res) {
  // print('here');
      var image = req.query.question;

      console.log(image);
      try {
        db.collection(QUESTIONS_COLLECTION).insertOne({Question: image, flag: "true"});
        // .then(response => response.json());
      } catch (e) {
        print(e);
        console.log(e);
        console.log(image);
      }
      
});


app.get("/user", function(req, res) {
  // print('here');
      var username = req.query.username;
      try {
        db.collection(QUESTIONS_COLLECTION).find({user: username}).toArray(function(err, result) {
          if (err) {
          } else {
            res.status(200).json(result);
          }
        });
      } catch (e) {
        console.log(e);
      }
      
});

app.get("/update", function(req, res) {


  let rawdata = fs.readFileSync('data.json');
  let questions = JSON.parse(rawdata);
  // console.log(questions.rows);
  for (var key in questions.rows) {
    rows = questions.rows;
    // console.log(rows[key]);
    // break;
    db.collection(QUESTIONS_COLLECTION).update(
       {Question: rows[key]['Question']},
       {$set:{'Question': rows[key]['Question'], 'Answer': rows[key]['Answer']}},
       { upsert: true}
    )
  }


})

// app.get("/missing", function(req, res) {
//  db.collection(MISSING_QUESTIONS_COLLECTION).find({}).toArray(function(err, result) {
//     if (err) {
//       console.log(err.message);
//       handleError(res, err.message, "No Answer");
//     } else {
//       res.status(200).json(result);
//     }
//   });
// });


  