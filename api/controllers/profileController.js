var Utils = require('../utils')
var upload = require('../services/file-upload')

exports.getProfile = function(req, res) {

    try {

        const {userId} = req.body
        
        Utils.checkParams({userId}, (err, param)=>{
            
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('userProfile')
            
            collection.findOne({user_id : Number(userId)}, (error, result) => {
                if(error) {
                    throw error
                }
                if(!result) {
                    res.send({status: false, message: "User does not exist."})
                } else {
                    res.send({status: true, response: result})
                }
            });
        })
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}

exports.editProfile = function(req, res) {

    try {

        const {userId} = req.body
        
        Utils.checkParams({userId}, (err, param)=>{
            
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('userProfile')

            delete req.body.userId

            collection.findOneAndUpdate({user_id: Number(userId)},{$set:req.body},{}, (error, result)=>{
                if(error) throw error;

                res.send({status: true, message: "Profile Updated Successfully."})
            })
            
        })
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}

exports.uploadPic = function(req, res) {
    try {

        var singleUpload = upload.single('image')

        singleUpload(req,res, (err) => {
            if(err) throw err;

            res.send({imageUrl: req.file.location})
        })

    } catch(err) {
        res.status(500).send({status: false, message: err});
    }
}

exports.changePassword = function(req, res) {

    try {

        const {userId, password, newPassword, reset} = req.body
        
        Utils.checkParams({userId, newPassword}, (err, param)=>{
            
            if(err) {
                res.status(500).send({status: false, message: `${param} Required`});
                return;
            }

            let db = req.app.locals.db
            let collection = db.collection('users')

            let changePass = () => Utils.encryptPass(newPassword, (err, pass)=>{
                if(err) throw err;

                collection.findOneAndUpdate({user_id: Number(userId)},{$set:{password: pass, otp: ''}},{}, (error, result)=>{
                    if(error) throw error;
    
                    res.send({status: true, message: "Password Updated Successfully."})
                })

            })
            
            collection.findOne({user_id : Number(userId)}, (error, result) => {
                if(error) {
                    throw error
                }
                if(!result) {
                    res.send({status: false, message: "User does not exist."})
                } else {
                    if(reset) {
                        changePass()
                    } else {
                        Utils.comparePass(password, result.password, (err, match)=>{
                            if(match) {
                                changePass()
                            } else
                                res.send({status: false, message: 'Incorrect Old Password'})
                        })
                    }

                }
            });
        })

        
    

    } catch(err) {
        res.status(500).send({status: false, message: 'Something went wrong'});
    }
}