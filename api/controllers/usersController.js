
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
                            user_id: seq,
                            otp: ''
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

exports.forgotPassword = function(req, res) {
    try {
        const {email} = req.body
        
        Utils.checkParams({email}, (err, param)=>{
            
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

                    let otp = Utils.generateOTP()

                    collection.findOneAndUpdate({user_id: Number(result.user_id)},{$set:{otp: otp}},{}, (error, updated)=>{
                        if(error) throw error;

                        let msg = {
                            to: email,
                            subject: 'One Time Password',
                            text: 'You have requested a One Time Password to reset your account. \n Your OTP is : ' + otp + '.',
                        };

                        Utils.sendMail(msg)
                        .then(()=>{
                            res.send({status: true, response: {userid: result.user_id}, message: "OTP Generated successfully."})
                        })
                        .catch(err=>{throw err})
                    })
                }
            });
        })
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}


exports.verifyOtp = function(req, res) {
    try {
        const {userId, otp} = req.body
        
        Utils.checkParams({userId, otp}, (err, param)=>{
            
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('users')

            collection.findOne({user_id : Number(userId)}, (error, result) => {
                if(error) {
                    throw error
                }
                if(!result) {
                    res.send({status: false, message: "User does not exist."})
                } else {

                    if(result.otp == otp) {
                        res.send({status: true, response: {userid: result.user_id}})
                    } else {
                        res.send({status: false, message: "Incorrect OTP."})
                    }
                }
            });


        })
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}