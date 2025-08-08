const Room = require('../../../domain/room.entity');

class StartDmUseCase {
    constructor(roomRepository, userRepository)
    {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    async execute({initiatorId, targetUserId})
    {
        if(initiatorId === targetUserId)
        {
            throw new Error('You cannot start a dm with yourself');
        }

        // Ensute the target userr exists
        const targetUser = await this.userRepository.findById(targetUserId);
        if(!targetUser)
        {
            throw new Error('Target user not found');
        }

          // Create a unique, consistent room name for the DM
        // By sorting the IDs, we ensure that no matter who initiates, the room name is the same.
        const sortedIds = [initiatorId, targetUserId].sort();
        const dmRoomName = `dm_${sortedIds[0]}_${sortedIds[1]}`;

         // Check if a DM room already exists between these two users
         let room = await this.roomRepository.findByName(dmRoomName);

         if(!room)
         {
            // if no room exists, Create a new one 
            const roomDescription = `Direct message betwen users`;;
            const members = [initiatorId, ,targetUserId];

            const newRoom = new Room(null, dmRoomName, roomDescription, initiatorId, members);
           
            // We'll add a property to distinguish it as a private DM room
            newRoom.isPrivate = true;

            room = await this.roomRepository.save(newRoom);

         }

         return room;
    }
}

module.exports = StartDmUseCase;