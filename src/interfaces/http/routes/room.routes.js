const express = require('express');
// const {verifyToken} = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createRoomSchema, joinRoomSchema } = require('../../../application/validations/room.schemas');

// The factory now accepts the controller AND the middleware
const createRoomRouter = (roomController, authMiddleware) =>{
    const router = express.Router();
    // Use the verifyToken middleware to protect all subsequent routes in this file

      router.use(authMiddleware.verifyToken);  // Protect all room routes


    router.post('/' , validate(createRoomSchema),roomController.createRoom.bind(roomController));
    router.get('/', roomController.getRooms.bind(roomController));
    router.post('/:roomId/join' , validate(joinRoomSchema), roomController.joinRoom.bind(roomController));

    return router;


}

module.exports = createRoomRouter;