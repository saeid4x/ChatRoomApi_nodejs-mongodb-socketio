class LoginUserCase{
    constructor(userRepository , passwordService, tokenService , tokenRepository)
    {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
        this.tokenRepository = tokenRepository;
    }

    async execute({email, password})
    {
        const user = await this.userRepository.findByEmail(email);
        if(!user)
        {
            throw new Error('Invalid credentials');
        }

        const isMatch = await this.passwordService.compare(password, user.password);
        if(!isMatch)
        {
            throw new Error('Invalid credentials');
        }

        const payload = {
            id:user.id,
            role:user.role,
            username:user.username
        };

        const {accessToken , refreshToken} = await this.tokenService.generateTokens(payload);

        // save hte refresh token for secure logout 
        await this.tokenRepository.save(user.id, refreshToken);
        return {accessToken , refreshToken, user};
    }
}


module.exports = LoginUserCase;