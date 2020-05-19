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
        console.log(req)

        var singleUpload = upload.single('image')

        singleUpload(req,res, (err) => {
            if(err) throw err;

            res.send({imageUrl: req.file.location})
        })

    } catch(err) {
        res.status(500).send({status: false, message: err});
    }
}

