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


//let uri = "mongodb://localhost:27017/laboratoare";
const uri = 'mongodb://student:h3T-bYhx-uW8@192.168.37.37:27017/sandbox';
const options = { useUnifiedTopology: true, useNewUrlParser: true };

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
        <li><a href='/list'>List items: Curriculum</a>
        <li><a href='/insert'>Insert item: OneBook</a> 
        <li><a href='/onebook'>List items: OneBook</a>
        <li><a href='/drop'>Drop collection</a>
    </ul>
</html>`);
});

//         <li><a href='/update'>Update item</a><br/>

app.get('/connection', (req,res) => {
  mongoose.connect(uri, options);
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once("open", function(err,resp) {
      console.log("MongoDB database connection established successfully");
  });

  res.json({
    'status':true
  });
  db.close();
})



app.get('/collections', (req,res) => {
  //mongoose.connect(uri, options);
  //let dbc = mongoose.connection;
  var dbc = mongoose.createConnection(uri, options);
  let strResponse="<html><body><ul>";

  dbc.once('open', function (ref) {
    console.log('Connected to mongo server.');
    dbc.db.listCollections().toArray(function (err, names) {
        //console.log(names); // [{ name: 'dbname.myCollection' }]
        console.log(names.length + " inregistrari");
        names.forEach(function (item, key) {
          strResponse += '<li>' + item.name +'</li>';
          console.log(' - ' + item.name);
          //strResponse = strResponse + '<li>' + item.name +'</li>';
        })
        strResponse += "</ul></body></html>";
        res.send(strResponse);
    })
  })
})



app.get('/list',(req,res)=>{
  var db = mongoose.createConnection(uri, options);
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
  


app.get('/insert',(req,res)=>{
  var db = mongoose.createConnection(uri, options);
  db.on('error', console.error.bind(console, 'connection error:'));
 
  db.once('open', function() {
    //console.log("Connection Successful!");
    const booksCollection = db.collection("onebook");
    var newItem = {authors:"Amit Phaltankar, Juned Ahsan, Michael Harrison, Liviu Nedov", title:"MongoDB Fundamentals: A hands-on guide to using MongoDB and Atlas in the real world"}

    booksCollection.insertOne(newItem)
      .then(result => {
        console.log(`Successfully inserted item with _id: ${result.insertedId}`)
      })  
      .catch(err => console.error(`Failed to insert item: ${err}`))

  })
  res.json({
    'status':true
  })
})




app.get('/onebook',(req,res)=>{
  var db = mongoose.createConnection(uri, options);
  db.on('error', console.error.bind(console, 'connection error:'));
 
  db.once('open', function() {
    //console.log("Connection Successful!");

    const collection = db.collection("onebook");
    console.log('\nOneBook collection:');
    collection.find().toArray((err, items) => {
      items.forEach(function (item,key) {
          console.log(' - ' + item.title);
      })
    });
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
    db.dropCollection("onebook", function(err, result) {
      console.log("Collection 'onebook' droped");
    });
  })
  res.json({'status':true})
  
})



app.listen(3000,(req,res)=>{
    console.log('server running on port 3000')
})
