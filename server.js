require('dotenv').config({path: __dirname + '/environment.env'})
require('https').globalAgent.options.ca = require('ssl-root-cas').create();

var express = require('express'),
app = express(),
port = process.env.PORT || 5000;

var http = require('http');
//asdknasdlknasmd
var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb+srv://mahajan:mongo@cluster0-u9qv8.mongodb.net/test?retryWrites=true&w=majority";
 var url = "mongodb+srv://Sarthak:mydb@cluster0-0utu1.mongodb.net/test?retryWrites=true&w=majority";
//var url = "mongodb://localhost:27017/myApp";
var bodyParser = require('body-parser');

var options = {
  // sslValidate: false
};

MongoClient.connect(url, options, function(err, db) {
    if (err) throw err;
    
    app.locals.db = db.db('myApp')
});

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
  }).listen(8081);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes')
routes(app)

app.listen(port);

console.log('RESTful API server started on: ' + port);
