const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    description:{type:String, trim:true},
    creator:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    members:[{type:mongoose.Schema.Types.ObjectId , ref:'User'}],
    isPrivate:{type:Boolean, default:false}

},{timestamps:true});


const RoomModel = mongoose.model("Room" , roomSchema);

module.exports = RoomModel;