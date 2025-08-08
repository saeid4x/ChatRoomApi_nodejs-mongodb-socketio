const Room = require("../../../domain/room.entity");

class CreateRoomUseCase 
{
    constructor(roomRepository)
    {
        this.roomRepository = roomRepository;

    }

    async execute({name, description, creatorId})
    {
        // ====  do validation with zod.so we can remove or comment out below code
        // if(!name || !creatorId)
        // {
        //     throw new Error("Room name and creator ID are required");
        // }

        
          // --- ADD THIS LOG TO DEBUG ---
        console.log('--- INSIDE CreateRoomUseCase ---');
        console.log('Received creatorId:', creatorId);
        // -----------------------------
        const newRoom = new Room(null, name, description, creatorId, [creatorId]);
        return this.roomRepository.save(newRoom);
    }
}

module.exports = CreateRoomUseCase;
