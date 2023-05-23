const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const usersSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        required: true
    }

},
    { timestamps: true })


var users=mongoose.model('users', usersSchema);

module.exports=users; 