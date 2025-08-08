const { z } = require('zod');

// The schema now directly defines the shape of the `req.body` object
const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long').trim(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const tokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

// We need to export this in a way our middleware can use it.
// We'll wrap it in an object that matches the structure the middleware expects.
module.exports = {
    registerSchema: z.object({ body: registerSchema }),
    loginSchema: z.object({ body: loginSchema }),
    tokenSchema: z.object({ body: tokenSchema }),
};