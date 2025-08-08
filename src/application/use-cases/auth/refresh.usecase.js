class RefreshTokenUseCase
{
    constructor(tokenRepository, tokenService)
    {
        this.tokenRepository =  tokenRepository;
        this.tokenService = tokenService;
    }

    async execute({refreshToken})
    {
        if(!refreshToken)
        {
            throw new Error('Refresh token is required');
        }

         // Verify the refresh token is valid and not expired
         const decoded = await this.tokenService.verifyRefreshTooken(refreshToken);

         // Verify the token exists in our database (it hasn't been logged out)
         const tokenInDb = await this.tokenRepository.findByToken(refreshToken);
         if(!tokenInDb)
         {
            throw new Error('Invalid refresh Token ');
         }

         // Generate a new access token 
         const payload = {id:decoded.id, role:decoded.role, username:decoded.username};
         const {accessToken} = await this.tokenService.generateTokens(payload);

         return {accessToken};
        
    }
}


module.exports = RefreshTokenUseCase;