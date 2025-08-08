class DmController {
    constructor(startDmUseCase)
    {
        this.startDmUseCase = startDmUseCase;
    }

    async startOrGetDm(req,res)
    {
        try{
            const initiatorId = req.user.id; // from auth middleware 
            const {userId: targetUserId} = req.params;

            const room = await this.startDmUseCase.execute({initiatorId, targetUserId});

            res.status(200).json({
                message:"DM session ready",
                room:room
            })
        } 
        catch(err)
        {
            res.status(400).json({message:err.message});
        }
    }
}



module.exports = DmController;