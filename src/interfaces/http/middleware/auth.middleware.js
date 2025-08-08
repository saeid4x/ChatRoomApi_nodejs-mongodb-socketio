// This middleware factory creates the token verification function.
// It depends on the token service and user repository to do its job.

const createAuthMiddleware = (tokenService, userRepository) =>
{
    const verifyToken  = async (req,res,next) =>{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            console.log(`===token bearer: ${req.headers.authorization }`)
            try{
                // get token fromheader (e.g:  "Bearer <token>")
                token = req.headers.authorization.split(' ')[1];

                 console.log(`===token:itself ${token}`)

                // 1. Verify the token using our injected service
                const decoded = await tokenService.verifyAccessToken(token);

                 // 2. Find the user in the DB using our injected repository
                // We select '-password' to ensure the hashed password is not attached to the request object.
                const user = await userRepository.findById(decoded.id);
   console.log(`=== user`,user)
                if(!user)
                {
                    return res.status(401).json({message:'User Not Found.'});
                }

                 // 3. Attach the user entity to the request for downstream handlers
                 req.user = user;
                 next(); // Proceed to the next middleware or route handler
            } 
            catch(err)
            {
                if(err.name ==[ 'TokenExpiredError']) 
                {
                    return res.status(401).json({message:'Not authorized. token expired'});
                }
                return res.status(401).json({message:"not authorized , token failed"});
            }
        }

        if(!token)
        {
            return res.status(401).json({message:"Not authorized. no token"});
        }
    };

     // We can also create an admin-only middleware here if needed
     const isAdmin = (req,res,next) =>
     {
        if(req.user && req.user.role === 'admin')
        {
            next();
        } else{
            res.status(403).json({message:"Access denied, Admin role required"});
        }

     };
     return {
        verifyToken,
        isAdmin
     };



};



module.exports = createAuthMiddleware;