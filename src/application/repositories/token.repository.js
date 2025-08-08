class TokenRepository{
    async findByUserId(userId) 
    {
        throw new Error('Method not implemented');
    };

    async findByToken(token)
    {
        throw new Error('method not implemented');
    }

    async save(userId, token)
    {
        throw new Error('method not implemented');
    }
    async deleteByToken(token)
    {
        throw new Error('Method not implemented')
    }
}

module.exports = TokenRepository;