const express = require('express');
const validate = require('../middleware/validation.middleware');
const {startDmSchema} = require('../../../application/validations/dm.schemas');

const createDmRouter = (DmController, authMiddleware) => {
    const router = express.Router();

    // protect all dm routes
    router.use(authMiddleware.verifyToken);

    // the endpoint to start a DM with another user
    router.post('/start/:userId', validate(startDmSchema) , DmController.startOrGetDm.bind(DmController));

    return router;
}


module.exports = createDmRouter;