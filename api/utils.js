var bcrypt = require('bcrypt');

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
    Object.keys(params).map(key=>{
        if (!params[key]) {
            callback(true, key)
        }
    })
    callback(false)
}