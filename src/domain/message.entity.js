class Message {
    // constructor(id,content,sender,room,createdAt)
    // {
    //     this.id = id ;
    //     this.content = content;
    //     this.sender = sender;  // Should be a User object or User ID
    //     this.room = room;  // Should be a Room ID
    //     this.createdAt = createdAt;
    // }
     constructor(id, sender, room, createdAt, type = 'text', content) {
        this.id = id;
        this.sender = sender;
        this.room = room;
        this.createdAt = createdAt;
        this.type = type;
        this.content = content;
    }
}

module.exports = Message;