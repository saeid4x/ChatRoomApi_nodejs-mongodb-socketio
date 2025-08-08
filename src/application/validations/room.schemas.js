const {z} = require('zod');

const createRoomSchema = z.object({
    body:z.object({
        name:z.string().min(3, 'Room name must be at least characters long ').max(50),
        description: z.string().max(200).optional(),
    })
})

const joinRoomSchema = z.object({
    params:z.object({
        roomId:z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val) , {
            message:'Invalid Room ID format'
        })
    })
})



module.exports = {
    createRoomSchema,
    joinRoomSchema,
};