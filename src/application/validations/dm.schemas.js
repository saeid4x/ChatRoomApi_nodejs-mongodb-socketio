const {z} = require('zod');

// Schema to validate that the target user ID is a valid MongoDB ObjectId
const startDmSchema = z.object({
    params:z.object({
        userId:z.string().refine((val) =>  /^[0-9a-fA-F]{24}$/.test(val) , {
            message:'Invalid target user id format'
        })
    })
})

module.exports = {
    startDmSchema
}