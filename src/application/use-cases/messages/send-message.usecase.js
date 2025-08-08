const Message = require("../../../domain/message.entity");

class SendMessageUseCase
{
    constructor(messageRepository)
    {
        this.messageRepository = messageRepository;
    }

     
    // The execute method now accepts a 'type' parameter
    async execute({ content, senderId, roomId, type = 'text' }) {
         // --- CHECKPOINT 2 ---
        console.log(`[CHECKPOINT 2] Inside SendMessageUseCase. Calling repository...`);
        // --------------------

        // if (!content || !senderId || !roomId) {
        //     throw new Error('Content, sender, and room are required.');
        // }
        
        // We now call the Message constructor with the correct arguments in the correct order.
        // constructor(id, sender, room, createdAt, type, content)
         const message = new Message(null, senderId, roomId, new Date(), type, content);
        
        return this.messageRepository.save(message)
    }
}

module.exports = SendMessageUseCase;