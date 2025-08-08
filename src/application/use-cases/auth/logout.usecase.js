class LogoutUseCase{
    constructor(tokenRepository)
    {
        this.tokenRepository = tokenRepository;
    }

    async execute({refreshToken})
    {
        if(!refreshToken)
        {
            throw new Error('refresh token is required');
        }

        const success = await this.tokenRepository.deleteByToken(refreshToken);
        if(!success)
        {
              // It's okay if the token was already gone, we can treat it as a success.
            // A strict implementation might throw an error here.
            console.log(`logout attemp for a token that was not in database`);
        }

        return {message:'Logged out successfully'};
    }
}

module.exports = LogoutUseCase;