const  TokenRepository  = require('../../../../application/repositories/token.repository');
const TokenModel = require('../models/token.model');

class TokenRepositoryImpl extends TokenRepository
{
    async findByToken(token)
    {
        return TokenModel.findOne({token});
    }

    async save(userId, token)
    {
     // Ensure only one refresh token exists per user by deleting the old one first
     await TokenModel.findOneAndDelete({userId});
     const newToken = new TokenModel({userId , token});
     return newToken.save();
    }

    async deleteByToken(token)
    {
        const result = await TokenModel.deleteOne({token});
        return result.deleteCount > 0;
    }

     // Implement other methods if needed
}

module.exports = TokenRepositoryImpl;