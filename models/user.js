let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


let UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    username: String,
    password: String,
});

const passportLocalMongoose = require('passport-local-mongoose');
UserSchema.methods.authenticate = function(password) {
    //implementation code goes here
}
UserSchema.plugin(passportLocalMongoose);
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');