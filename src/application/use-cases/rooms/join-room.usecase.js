class JoinRoomUseCase
{
    constructor(roomRepository)
    {
        this.roomRepository = roomRepository;
    }

    async execute({roomId, userId})
    {
        const room = await this.roomRepository.findById(roomId);
        if(!room)
        {
            throw new Error('Room not found');
        }

        // Add member if not already is the room
        if(!room.members.includes(userId))
        {
            return this.roomRepository.addMember(roomId, userId);
        }
        return room;  // Return the room if user is already a member
    }
}

module.exports = JoinRoomUseCase;