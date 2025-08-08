class RoomController 
{
    constructor(createRoomUseCase, listRoomsUseCase, joinRoomUseCase)
    {
        this.createRoomUseCase = createRoomUseCase;
        this.listRoomsUseCase = listRoomsUseCase;
        this.joinRoomUseCase = joinRoomUseCase;
    }

    async createRoom(req,res)
    {
        try{
            const {name, description} = req.body;
            console.log(`=== req.user `,req.user)
            const creatorId = req.user.id // from auth middleware;
            const room = await this.createRoomUseCase.execute({name, description, creatorId});
            res.status(201).json(room);

        } catch(err)
        {
            console.log(`=== error`,err)
            res.status(400).json({message:err.message});
        }
    }

    async getRooms(req,res)
    {
        try{
            const rooms = await this.listRoomsUseCase.execute();
            res.status(200).json(rooms);
        } catch(err)
        {
            res.status(500).json({message:err.message});
        }
    }

    async joinRoom(req,res)
    {
        try{
            const {roomId} = req.params;
            const userId = req.user.id; //from auth middlrware
            const room = await this.joinRoomUseCase.execute({roomId, userId});
            res.status(200).json({message:`Successfully joined room: ${room.name}`});

        } catch(err)
        {
            res.status(400).json({message:err.message});
        }
    }
}

module.exports = RoomController;