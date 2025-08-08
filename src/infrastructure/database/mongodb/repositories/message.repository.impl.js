const MessageRepository = require('../../../../application/repositories/message.repository');
const MessageModel = require('../models/message.model');

class MessageRepositoryImpl extends MessageRepository {
    async save(message) {
        console.log(`[CHECKPOINT 3] Inside MessageRepository. About to call Mongoose .save()`);

        const newMessage = new MessageModel({
            content: message.content,
            sender: message.sender,
            room: message.room,
            type: message.type,
        });

        // Step 1: Save the document to the database.
        const savedMessage = await newMessage.save();
        console.log(`--- Mongoose .save() was successful. Document ID: ${savedMessage._id}`);

        // --- THIS IS THE CRITICAL CHANGE ---
        // Step 2: Re-fetch the saved document by its ID and then populate it.
        // This is a more stable pattern than chaining .populate() directly onto a save result.
        const populatedMessage = await MessageModel.findById(savedMessage._id)
            .populate('sender', 'username') // Populate the 'sender' field, only selecting the 'username'.
            .exec(); // Execute the query.
        // ------------------------------------

        // --- FINAL CHECKPOINT ---
        console.log(`[CHECKPOINT 5] Population was successful. Returning message.`);
        
        return populatedMessage;
    }

    async findByRoomId(roomId, limit = 50) {
        return MessageModel.find({ room: roomId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('sender', 'username')
            .exec();
    }

    async findById(messageId)
    {
        return MessageModel.findById(messageId);
    }

    async updateContent(messageId, newContent)
    {
        return MessageModel.findByIdAndUpdate(
            messageId,
        {
            content:newContent, edited:true  // We can add an 'edited' flag
        },

        {
            new:true // 'new: true' returns the document after the update
        }
    
    ).populate('sender', 'username');
    }


    async deleteById(messageId)
    {
        return MessageModel.findByIdAndDelete(messageId);
    }
}

module.exports = MessageRepositoryImpl;