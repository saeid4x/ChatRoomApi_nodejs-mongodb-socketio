class MessageRepository 
{
    async save(message) {throw new Error('method not implemented')}
    async findByRoomId(roomId, limit = 50) {throw new Error('method not implemented')}
     async findById(messageId) { throw new Error('Method not implemented'); } 
    async updateContent(messageId, newContent) { throw new Error('Method not implemented'); }  
    async deleteById(messageId) { throw new Error('Method not implemented'); } 
}

module.exports = MessageRepository;