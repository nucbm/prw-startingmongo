const express = require('express');
const mongoose = require('mongoose');

// custom middleware create
const LoggerMiddleware = (req,res,next) =>{
    console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`)
    next();
}
const app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// application level middleware
app.use(LoggerMiddleware);



// Function to handle the root path
app.get('/', async function(req, res) {
    const userid = 371;
    res.send(`
<!DOCTYPE html> 
<html lang="en">
  <head>
    <title>PRW07</title>
  </head>
  <body>
    <h2>demonstrații MongoDB</h2>
    <ul>
        <li><a href='/connection'>Connection</a>
        <li><a href='/collections'>List Collections </a>
        <li><a href='/list'>List items</a>
        <li><a href='/insert'>Insert item</a> 
        <li><a href='/drop'>Drop collection</a>
        <li><a href='/update'>Update item</a><br/>
    </ul>
</html>`);
});


app.get('/connection', (req,res) => {
    var uri = "mongodb://localhost:27017/laboratoare";
    mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    const connection = mongoose.connection;

    connection.once("open", function() {
      console.log("MongoDB database connection established successfully");
    });

    res.json({
      'status':true
    })
})



app.get('/collections', (req,res) => {
  var uri = "mongodb://localhost:27017/laboratoare";
  mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  
  mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //trying to get collection names
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
    });
  })
  res.json({
    'status':true
  })
})


app.get('/list',(req,res)=>{
  var uri = "mongodb://localhost:27017/laboratoare";
  mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  
  // get reference to database
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
 
  db.once('open', function() {
    console.log("Connection Successful!");

    const collection = db.collection("curriculum");
    console.log('\nCurriculum collection:');
    collection.find().toArray((err, items) => {
      items.forEach(function (item,key) {
          console.log(' - ' + item.course);
      })
    });
  })
  res.json({
    'status':true
  })
})
  

var last_id;

app.get('/insert',(req,res)=>{
  var uri = "mongodb://localhost:27017/laboratoare";
  mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  
  // get reference to database
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
 
  db.once('open', function() {
    //console.log("Connection Successful!");
    const booksCollection = db.collection("books");
    var newItem = {authors:"Amit Phaltankar, Juned Ahsan, Michael Harrison, Liviu Nedov", title:"MongoDB Fundamentals: A hands-on guide to using MongoDB and Atlas in the real world"}

    booksCollection.insertOne(newItem)
      .then(result => {
        last_id = result.insertedId;
        console.log(`Successfully inserted item with _id: ${result.insertedId}`)
        //console.log('am actualizat last_id:' + last_id);
      })  
      .catch(err => console.error(`Failed to insert item: ${err}`))

  })
  res.json({
    'status':true
  })
})



app.get('/drop', (req,res) => {
  var uri = "mongodb://localhost:27017/laboratoare";
  mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
  
  // get reference to database
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));


  db.once('open', function() {
    db.dropCollection("books", function(err, result) {
      console.log("Collection droped");
    });
  })
  res.json({'status':true})
  
})



app.listen(3000,(req,res)=>{
    console.log('server running on port 3000')
})