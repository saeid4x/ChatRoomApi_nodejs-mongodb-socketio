const bcrypt = require('bcrypt');
 const PasswordService = require('../../application/services/password.service');

class BcryptService extends PasswordService
{
    async hash(password)
    {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    
    async compare(plainPassword , hashedPassword)
    {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

}


module.exports = BcryptService;