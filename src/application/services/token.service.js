// Abstract contract for jwt operations

class TokenService {
    async generateTokens(payload)
    {
        throw new Error('method not implemented');
    }
    async verifyAccessToken(token)
    {
        throw new Error('method not implemented');
    }

    async verifyRefreshToken(token)
    {
         throw new Error('Method not implemented');
    }
}

module.exports = TokenService;