var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

exports.encryptPass = (password, callback) => {
    try {
        bcrypt.genSalt(10, (err, salt)=>{
            if(err)
                throw err
            bcrypt.hash(password, salt, (err, hash) =>{
                if(err)
                    throw err
                return callback(false, hash)
            })
        })
    } catch(err) {
        return callback(err, null)
    }
}

exports.comparePass = (password, hash, callback) => {
    try {
        bcrypt.compare(password, hash, (err, match)=> {
            if(err)
                throw err

            callback(false, match)
        })

    } catch(err) {
        return callback(err, null)
    }
}


exports.checkParams = async (params, callback) => {

    let bool = false
    let par = ''

    if(Object.keys(params).length==0) {
        bool = false
        return;
    } else {
       
        let keys = Object.keys(params)

        for(let i = 0; i<keys.length; i++) {
            if(!params[keys[i]]) {
                bool = true
                par = keys[i]
                break;
            }
        }

        callback(bool, par)
    }
}

// exports.getNextSequence = (db, name, callback) => {

//     let collection = db.collection("counters")

//     collection.findOne({_id : name}, (error, result) => {
//         if(error) callback(error, result);

//         if(!result) {

//             let item = {
//                 _id: name,
//                 seq: 1
//             }

//             collection.insertOne(item, (err, result) => {
//                 if(err) callback(err, result);
//                 callback(err, 0);
//             });
            
//         } else {
//             collection.findAndModify( { _id: name }, null, { $inc: { seq: 1 } }, function(err, result){
//                 if(err) callback(err, result);
//                 callback(err, result.value.seq);
//             } );
//         }
//     })

    
// }

exports.getNextSequence = (db, name) => {

    return new Promise((resolve, reject)=>{
        let collection = db.collection("counters")

        collection.findOne({_id : name}, (error, result) => {
            if(error) reject(error);
    
            if(!result) {
    
                let item = {
                    _id: name,
                    seq: 1
                }
    
                collection.insertOne(item, (err, result) => {
                    if(err) reject(err);
                    resolve(0);
                });
                
            } else {
                collection.findAndModify( { _id: name }, null, { $inc: { seq: 1 } }, function(err, result){
                    if(err) reject(err);
                    resolve(result.value.seq);
                } );
            }
        })
    })
    

    
}



exports.sendMail = (msgDetails) => {
    sgMail.setApiKey('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');

    let msg = {
        to: 'mahajan8sm@gmail.com',
        from: 'mahajan8sm.3@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending Test Mail',
        text: 'Your OTP is 555555',
    };

    msg = {
        ...msg,
        ...msgDetails
    }

    return new Promise((resolve, reject) => {
        sgMail
        .send(msg)
        .then(() => {
            resolve()
        }, error => {
            console.error(error);

            if (error.response) {
                reject(error.response.body)
            }
        });
    })
}

exports.generateOTP = () =>{

    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 4; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
    
}