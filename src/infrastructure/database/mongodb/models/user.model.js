// This is a framework-specific data model (Mongoose).
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        unique:true,
        trim:true
    },

    password:{
        type:String,
        required:true        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    role:{
        type:String,
        enum:['user','moderator', 'editor', 'admin'],
        default:'user'
    }
},{timestamps:true});

const UserModel = mongoose.model('User',  userSchema);
module.exports = UserModel;