
var Utils = require('../utils')


exports.signup = function(req, res) {
    try {
        
    let db = req.app.locals.db
    let collection = db.collection('users')

    Utils.encryptPass(req.body.password, (err, password)=>{
        if(err)
            throw err
        req.body = {
            ...req.body,
            password: password
        }

        let regex = new RegExp('^'+req.body.email+'$', 'i')

        collection.find({email: regex}).toArray((err, arr)=> {
            if(err)
                throw err
            if(arr.length) {
                res.send({status: false, message: 'Email Already Exists'})
            } else {
                collection.insertOne(req.body, (error, result) => {
                    if(error) {
                        throw error;
                    }
                    res.send({status: true, response: {userid: result.insertedId}, message: 'Success'});
                });
            }
            
        })
        
    })
    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
};

exports.login = function(req, res) {
    try {
        const {email, password} = req.body
        
        Utils.checkParams({email, password}, async (err, param)=>{
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('users')

            let regex = new RegExp('^'+req.body.email+'$', 'i')

            collection.findOne({email : regex}, (error, result) => {
                if(error) {
                    throw error
                }
                if(!result) {
                    res.send({status: false, message: "User does not exist."})
                } else {
                    Utils.comparePass(req.body.password, result.password, (err, match)=>{
                        if(match) 
                            res.send({status: true, response: {userid: result._id}, message: 'Success'})
                        else
                            res.send({status: false, message: 'Incorrect Password'})
                    })
                }
            });


        })
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}
