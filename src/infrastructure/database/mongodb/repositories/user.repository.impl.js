const UserRepository = require("../../../../application/repositories/user.repository");
const UserModel = require("../models/user.model");
const User = require("../../../../domain/user.entity");
 

// This class provides a concrete implementation of the UserRepository contract
// using Mongoose for data persistence.

class UserRepositoryImpl extends UserRepository
{
    async findByEmail(email)
    {
        const userDoc = await UserModel.findOne({email});
        if(!userDoc) return null;

        return new User(userDoc._id, userDoc.username, userDoc.email,userDoc.password, userDoc.role);        
    }

    async findById(id)
    {
        const userDoc = await UserModel.findById(id);
        if(!userDoc) return null; 
        return new User(userDoc._id, userDoc.username, userDoc.email, userDoc.password, userDoc.role);
    }

    async save(user)
    {
        const {username, email, password, role} = user;
        const newUserDoc = new UserModel({username, email, password, role});
        await newUserDoc.save();
        return new User(newUserDoc._id , newUserDoc.username, newUserDoc.email, newUserDoc.password, newUserDoc.role);        
    }
    // Implement other methods like findByUsername...

}

module.exports = UserRepositoryImpl;