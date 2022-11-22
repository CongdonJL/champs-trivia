var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
const fs = require('fs');
var ObjectID = mongodb.ObjectID;

const cors = require('cors');
const corsOptions ={
    origin:'https://wwechampions.com/',  
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

var QUESTIONS_COLLECTION = "questionsCollection";
var MISSING_QUESTIONS_COLLECTION = "missingQuestionsCollection";


var app = express();

app.use(cors(corsOptions));
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
  var ans1 = req.query.ans1;
  var ans2 = req.query.ans2;
  var ans3 = req.query.ans3;
  var ans4 = req.query.ans4;


  if (!(question)) {
    handleError(res, "Invalid user input", "Must provide a question and answer.", 400);
  } else {
   db.collection(QUESTIONS_COLLECTION).find({Question: question}).toArray(function(err, result) {
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

            db.collection(QUESTIONS_COLLECTION).insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
        }
        res.status(200).json(result);
      }
    });
  }
});

/*  "/questions"
 *    GET: finds all questions
 *    POST: creates a new question
 */

app.get("/newQuestion", function(req, res) {
  var question = req.query.fixQuestion;
  var answer = req.query.answer;

    const doc = {
      Question: question,
      Answer: answer,
      Flag: true
    }

    // console.log(doc);


   db.collection(QUESTIONS_COLLECTION).insertOne(doc), function(err,r){
      if (err) {
        reject(err); 
      }else{
        resolve(r);
      } 
    };
 });

app.put("update", function(req, res) {
  var question = req.query.question;
  var answer = req.query.answer;

  

  return [];
})

//sheamus and cesaro
//count out

app.get("/missing", function(req, res) {
  
     db.collection(QUESTIONS_COLLECTION).find({Flag: "Missing"}).toArray(function(err, result) {
        if (err) {
        } else {
          res.status(200).json(result);
        }
      });

    res.status(200);

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
            if (result.length == 0){
            myobj = {
              "user": username,
              "approved": null,
            };

            db.collection(QUESTIONS_COLLECTION).insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
        }
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


app.get("/energyCost", function(req, res) {


result =  {"status":"success","statusCode":200,"data":{"energyCost":0,"reward":100}};
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json(result);

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


  