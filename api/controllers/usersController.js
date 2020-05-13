
var Utils = require('../utils')


exports.signup = function(req, res) {
    try {
        
    let db = req.app.locals.db
    let collection = db.collection('users')
    let ProfileCollection = db.collection('userProfile')

    const {email, password} = req.body

    Utils.checkParams({email, password}, (err, param)=>{
            
        if(err) {
            res.status(500).send({status: false, message: `${param} Required`});
            return;
        }

        Utils.encryptPass(password, (err, pass)=>{
            if(err)
                throw err
            
            let regex = new RegExp('^'+req.body.email+'$', 'i')

            collection.find({email: regex}).toArray((err, arr)=> {
                if(err)
                    throw err
                if(arr.length) {
                    res.send({status: false, message: 'Email Already Exists'})
                } else {
                    Utils.getNextSequence(db, 'users')
                    .then(seq=>{
                        
                        let auth = {
                            email: email,
                            password: pass,
                            user_id: seq
                        }

                        delete req.body.password

                        let profile = {
                            ...req.body,
                            user_id: seq,
                            myStories: 0,
                            contributions: 0,
                            profilePic: '',
                            favorites: []
                        }
                        
                        collection.insertOne(auth, (error, result) => {
                            if(error) {
                                throw error;
                            }
                            ProfileCollection.insertOne(profile, (error, result) => {
                                if(error) {
                                    throw error;
                                }
                                
                                res.send({status: true, response: {userid: result.ops[0].user_id}, message: 'Success'});
                            });
                        });
                    })
                    .catch(err=>{throw err})
                }
                
            })
            
        })
    })
    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
};

exports.login = function(req, res) {
    try {
        const {email, password} = req.body
        
        Utils.checkParams({email, password}, (err, param)=>{
            
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
                            res.send({status: true, response: {userid: result.user_id}, message: 'Success'})
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
