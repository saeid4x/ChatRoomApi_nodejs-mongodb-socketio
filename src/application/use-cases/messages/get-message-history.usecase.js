class GetMessageHidtoryUseCase{
    constructor(messageRepository)
    {
        this.messageRepository = messageRepository;
    }
    async execute({roomId})
    {
        return this.messageRepository.findByRoomId(roomId, 50);
    }
    
}


module.exports = GetMessageHidtoryUseCase;