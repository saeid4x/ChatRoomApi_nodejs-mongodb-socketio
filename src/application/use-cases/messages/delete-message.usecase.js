class  DeleteMessageUseCase {
    constructor(messageRepository){
        this.messageRepository = messageRepository;
    }

    async execute({messageId, requestingUserId})
    {
        if(!messageId)
        {
            throw new Error("Message id is required");
        }

        const message = await this.messageRepository.findById(messageId);
        if(!message)
        {
            // It's okay if the message is already gone, just return success.
            return {success:true}
        }

        // -- authorization check 
        if(message.sender.toString() !== requestingUserId)
        {
            throw new Error("You are not authorized to delete this message");
        }

        // delete the message from database
        await this.messageRepository.deleteById(messageId);
        return {success:true, messageId}
    }
}

module.exports = DeleteMessageUseCase;