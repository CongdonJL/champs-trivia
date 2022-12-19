var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://wweChamps:trivia@trivia-questions.bfdzixh.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("trivia").collection("questions");

  collection.findOne({
    "question": "test"
  });
  // perform actions on the collection object
  client.close();
});

