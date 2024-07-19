const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;

// const userSchema = new Schema({
//     username,email,phone,password: {
//         type: String,
//         required: true
//     }
// })
//schema is the thing that defines the structure of our documents , the model is the the thing
//that surrounds that and gives us the interface to communicate with a database collection for that
//document type
//the name of the model iis given a capital letter
//we use the model to create a new instance of the user document
