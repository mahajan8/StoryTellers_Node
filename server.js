var express = require('express'),
app = express(),
port = process.env.PORT || 3000;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://mahajan:mongo@cluster0-u9qv8.mongodb.net/test?retryWrites=true&w=majority";
var bodyParser = require('body-parser');

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    
    app.locals.db = db.db('mydb')
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/usersRoutes')
routes(app)

app.listen(port);

console.log('RESTful API server started on: ' + port);