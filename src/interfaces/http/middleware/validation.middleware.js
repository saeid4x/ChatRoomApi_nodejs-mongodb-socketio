const validate = (schema) => (req,res,next) =>{
    try{
        schema.parse({
            body:req.body,
            params:req.params,
            query:req.query
        });

        next();
    } catch(err)
    {
         // The error from Zod is an array of issues.
        // We can format it for a cleaner client-side response.
        const formattedErrors = err.issues.map(e => ({
            message:e.message,
            path:e.path.join('.')
        }));

        return res.status(400).json({
            message:'Input validation failed',
            errors:formattedErrors
        })
    }
}

module.exports = validate;