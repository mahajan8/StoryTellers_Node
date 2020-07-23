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

exports.support = function(req, res) {

    try {

        const {userId, subject, description, type} = req.body

        Utils.checkParams({ userId, subject, description, type}, (err, param)=>{
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('support')
                    
            collection.insertOne(req.body, (error, result) => {
                if(error) {
                    throw error;
                }
            
                res.send({status: true, message: 'Request Submitted Successfully.'});
            });
        })
        
    } catch(err) {
        res.status(500).send({status: false, message: 'Error Submitting Request. Try again later.'});
    }
}

exports.getSortOptions = function(req, res) {

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

exports.getQueryString = function(req, res) {

    try {

        Utils.sendMail()
        .then(()=>res.send({status: true, message: 'Mail Sent'}))
        .catch(err=>res.send({status: false, message: 'Error: '+ JSON.stringify(err)}))
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}