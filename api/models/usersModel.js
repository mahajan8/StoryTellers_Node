var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    name: {
        type: String,
        required
    },
    age: {
        type: Number
    },
    country: {
        type: String
    }
})

module.exports = mongoose.model('Users', UserSchema);