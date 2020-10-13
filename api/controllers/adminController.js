
var Utils = require('../utils')

exports.adminLogin = function(req, res) {
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
