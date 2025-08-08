class EditMessageUseCase{
    constructor(messageRepository)
    {
        this.messageRepository = messageRepository;
    }

    async execute({messageId, requestingUserId, newContent})
    {
        if(!messageId || !newContent)
        {
            throw new Error("message id nad new content are required");
        }

        const message = await this.messageRepository.findById(messageId);
        if(!message)
        {
            throw new Error('Message not found');
        }

         // --- Authorization Check ---
        // Ensure the user trying to edit the message is the original sender.
        if(message.sender.toString() !== requestingUserId)
        {
            throw new Error('you are not authorized to edit this message');
        }
        // Update the message content and save it
        return this.messageRepository.updateContent(messageId, newContent);
    }
}

module.exports = EditMessageUseCase;