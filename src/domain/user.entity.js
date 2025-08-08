// This is a pure business object. It doesn't know about databases or frameworks.
class User {
    constructor(id, username, email, password, role='user')
    {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

module.exports  = User;
