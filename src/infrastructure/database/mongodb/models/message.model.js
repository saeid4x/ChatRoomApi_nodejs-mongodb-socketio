const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content:{type:String, required:true},
    sender:{type:mongoose.Schema.Types.ObjectId, ref:"User" , required:true},
    room:{type:mongoose.Schema.Types.ObjectId, ref:"Room" , required:true},
     type: {
        type: String,
        enum: ['text', 'image'], // Only allows these two values
        default: 'text'
    },
    edited:{
        type:Boolean,
        default:false
    }

},{timestamps:true});


const MessageModel = mongoose.model('Message', messageSchema);
module.exports = MessageModel