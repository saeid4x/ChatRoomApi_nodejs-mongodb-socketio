const express = require('express');
const upload = require('../../../infrastructure/services/multer.config');

const createUploadRouter = (uploadController, authMiddleware) =>
{
    const router = express.Router();
    router.use(authMiddleware.verifyToken);

     // This route uses the multer middleware to handle a single file upload
    // from a form field named 'image'.
    router.post(
        '/image',
        upload.single('image'),  // 'image' must match the field name in the client's FormData
        uploadController.uploadImage.bind(uploadController)
    
    );

    return router;


}

module.exports = createUploadRouter;