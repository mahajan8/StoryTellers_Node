var express = require('express'),
app = express(),
port = process.env.PORT || 3000;

var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb+srv://mahajan:mongo@cluster0-u9qv8.mongodb.net/test?retryWrites=true&w=majority";
// var url = "mongodb+srv://Sarthak:mydb@cluster0-0utu1.mongodb.net/test?retryWrites=true&w=majority";
var url = "mongodb://localhost:27017/myApp";
var bodyParser = require('body-parser');

MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    // let categories = [
    //     {name: 'One', _id: 0},
    //     {name: 'Two', _id: 1},
    //     {name: 'Three', _id: 2},
    //     {name: 'Four', _id: 3},
    // ]
    // db.db('myApp').collection('categories').insertMany(categories,(err, response) => {
    //     console.log(err)
    //     console.log(response)
    // })
    
    app.locals.db = db.db('myApp')
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/usersRoutes')
routes(app)

app.listen(port);

console.log('RESTful API server started on: ' + port);