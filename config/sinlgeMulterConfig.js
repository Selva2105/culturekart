const multer = require("multer");
const path = require('path');


// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/user');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded image
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB limit
    },
    fileFilter: function (req, file, cb) {
        // Check if the uploaded file is an image (jpeg, jpg, png, webp)
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            // If the file type is not allowed, return an error
            cb(new CustomError('Only images (jpeg, jpg, png) are allowed', 400));
        }
    }
}).single('profileImage');

module.exports = { upload }