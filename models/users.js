const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const usersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false 
    }

},
    { timestamps: true })


var users=mongoose.model('users', usersSchema);

module.exports=users; 