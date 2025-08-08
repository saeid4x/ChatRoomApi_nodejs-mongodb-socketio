// Abstract contract for password hashing and comparison.
class PasswordService {
    async hash(password)
    {
        throw new Error('Method not implemented ');
    };

    async compare(plainPassword, hashedPassword)
    {
        throw new Error('method not implemented');
    }

}

module.exports = PasswordService;