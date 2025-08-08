const User  = require("../../../domain/user.entity");

class RegisterUseCase{
      // We depend on abstractions (contracts), not concrete implementations.
      constructor(userRepository, passwordService)
      {
        this.userRepository = userRepository;

        this.passwordService = passwordService;
      }

      async execute({username, email, password})
      {
        const existingUser = await this.userRepository.findByEmail(email);
        if(existingUser)
        {
            throw new Error('User with this email already exists');
        }

        const hashedPassword= await this.passwordService.hash(password);
        const newUser = new User(null, username,email,hashedPassword);

        return this.userRepository.save(newUser);
      }
}

module.exports = RegisterUseCase;