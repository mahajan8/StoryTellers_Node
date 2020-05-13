var Utils = require('../utils')

exports.getCategories = function(req, res) {

    try {

        let db = req.app.locals.db
        let collection = db.collection('categories')

        collection.find({}).toArray((err, response)=> {
            if(err) throw err;

            res.send({status: true, response: response})
        })
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}
