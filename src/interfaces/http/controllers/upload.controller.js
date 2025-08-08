class Uploadcontroller {
     // The controller's job is simple: if the upload was successful,
    // respond with the path to the file. The multer middleware does all the work.
    uploadImage(req,res)
    {
        if(!req.file)
        {
            return res.status(400).json({message:'No file uploaded'});
        }

        // The file is now saved on the server. We send back the URL to access it.
        // We construct the URL based on how we serve static files.
        const fileUrl = `/static/uploads/images/${req.file.filename}`;
         

        res.status(201).json({
            message:"file uploaded successfully",
            filePath:fileUrl
        });
        
    }
}

module.exports = Uploadcontroller