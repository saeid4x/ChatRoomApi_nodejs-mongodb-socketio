const multer = require('multer')
const path = require('path');

// configure how files are stored
// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         // the destinition floder for our uploads
//         cb(null, 'public/uploads/images');
//     },
//     filename:function(req, file, cb) {
//          // Create a unique filename to avoid overwriting files
//         // Filename: fieldname-timestamp.extension
//         const uniqueSuffix = Date.now() + "-"+Math.round(Math.random() * 1E9);
//         cb(null, file.filename + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// })
// Configure how files are stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // The destination folder for our uploads
        // cb(null, '../public/uploads/images');
        cb(null, path.join(__dirname, '../../..', 'public/uploads/images'));
    },
    filename: function (req, file, cb) {
        // Create a unique filename to avoid overwriting files
        // Filename: fieldname-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// filter for image files 
const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif')
    {
        cb(null, true);
    } 
    else
    {
        cb(new Error('Unsupported file type'), false);
    }
};

// Create the Multer instance with our configuration
const upload = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 50 // 50 MB file size limit
    },
    fileFilter:fileFilter
});

module.exports = upload ;