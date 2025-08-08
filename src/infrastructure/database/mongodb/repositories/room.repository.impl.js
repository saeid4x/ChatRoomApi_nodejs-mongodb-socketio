const RoomRepository = require('../../../../application/repositories/room.repository');
const RoomModel = require('../models/room.model');

class RoomRepositoryImpl extends RoomRepository
{
    async save(room)
    {
        const newRoom = new RoomModel({
            name:room.name,
            description:room.description,
            creator:room.creatorId,
            members: room.members
        });

    try{

        return await newRoom.save();
    } catch(error)
    {
          // Add a log here to see the object just before the failed save.
            console.error("--- MONGOOSE SAVE FAILED ---");
            console.error("Data sent to Mongoose:", newRoom.toObject());
            console.error("Original Mongoose Error:", error);
            // Re-throw the error so the controller can catch it.
            throw error;
    }
    }

    async findById(roomId)
    {
        return RoomModel.findById(roomId);
    }

    async findAll()
    {
        return RoomModel.find().populate('creator' , 'username').sort({createdAt:-1});

    }

    async addMember(roomId , userId)
    {
        return RoomModel.findByIdAndUpdate(roomId , { $addToSet:{ members:userId }} , {new:true});
    }

    async findByName(name)
    {
        return RoomModel.findOne({name});
    }
}

module.exports = RoomRepositoryImpl;