// This is an abstract contract, not a concrete implementation.
// It defines what methods our data access layer must have.
class UserRepository{
    async findByEmail(email){
        throw new Error('Method not implemented');
    }
    async findById()
    {
        throw new Error("method now implemented");
    };

    async save(user)
    {
        throw new Error('method not implemented');
    }

}


module.exports = UserRepository;