class AuthController {
      // The controller receives the already instantiated use cases.
      constructor(registerUseCase , loginUseCase, logoutUseCase, refreshTokenUseCase)
      {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.logoutUseCase = logoutUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
      }

    async register(req,res)
    {
        try{
            const {username, email, password} = req.body;
            await this.registerUseCase.execute({username, email, password});
            res.status(201).json({message:'User registered successfully'});
        } catch(err)
        {
            res.status(400).json({message:err.message});
        }
    }

    async login(req,res)
    {
        try{
            const {email,password} =  req.body;
            const data = await this.loginUseCase.execute({email,password});
            res.status(200).json(data);
        } catch(err)
        {
            res.status(401).json({
                message:err.message
            })
        }
    }

     async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            const result = await this.logoutUseCase.execute({ refreshToken });
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const result = await this.refreshTokenUseCase.execute({ refreshToken });
            res.status(200).json(result);
        } catch (error) {
            res.status(403).json({ message: error.message }); // 403 Forbidden is appropriate here
        }
    }
}

module.exports = AuthController;