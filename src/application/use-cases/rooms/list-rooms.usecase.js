class ListRoomsUseCase {
    constructor(roomRepository)
    {
        this.roomRepository = roomRepository;
    }

    async execute()
    {
        return this.roomRepository.findAll();
    }
}

module.exports = ListRoomsUseCase;