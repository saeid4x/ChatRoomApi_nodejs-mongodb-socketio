const express = require('express');
const validate = require('../middleware/validation.middleware');
const { registerSchema, loginSchema, tokenSchema } = require('../../../application/validations/auth.schemas');

// This function takes the controller as a dependency and returns the configured router
const createAuthRouter = (authController) => {
    const router = express.Router();

    // We bind the controller methods to ensure 'this' context is correct
    router.post('/register', validate(registerSchema), authController.register.bind(authController));
    router.post('/login', validate(loginSchema), authController.login.bind(authController));
    router.post('/logout',  validate(tokenSchema), authController.logout.bind(authController));
    router.post('/refresh-token',validate(tokenSchema), authController.refreshToken.bind(authController));

    return router;
};

module.exports = createAuthRouter;