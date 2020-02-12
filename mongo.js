var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://mahajan:mongo@cluster0-u9qv8.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = [
        { detail: "Detail", name: 'Name', age: "22" },
        { detail: "Detail", name: 'Name', age: "22" },
        { detail: "Detail", name: 'Name', age: "21" },
    ];

let user = {name: 'Sarthak'}
dbo.collection("customers").find(user).sort({age:-1}).toArray( function(err, res) {
    if (err) throw err;
    console.log(res);
    db.close();
});
});


// JOIN
// let query = {
//     $lookup : {
//         from: 'customers',
//         localField: 'age',
//         foreignField: 'age',
//         as: 'details'
//       }
// }
// dbo.collection("details").aggregate([query]).toArray((err, res)=>{
//     if(err) {
//         throw err;
//     }

//     console.log(JSON.stringify(res))
//     db.close()
// });

// dbo.collection("details").insertMany(myobj, function(err, res) {
//     if (err) throw err;
//     console.log(res);
//     db.close();
// });

// Query and Sort
// let user = {name: 'Sarthak'}
// dbo.collection("customers").find(user).sort({age:-1}).toArray( function(err, res) {
//     if (err) throw err;
//     console.log(res);
//     db.close();
// });

// Create DB and Collection
// if (err) throw err;
// var dbo = db.db("mydb");
// dbo.createCollection("customers", function(err, res) {
//   if (err) throw err;
//   console.log("Collection created!");
//   db.close();
// });

