class Room {
    constructor(id, name, description, creatorId, member =[])
    {
        this.id = id;
        this.name = name;
        this.description = description;
        this.creatorId = creatorId;  // Should be a User ID
        this.members = this.members;  // Array of User IDs
    }
}

module.exports = Room