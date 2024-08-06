const express = require('express');

const { updateUser, uploadDocument } = require('../controller/userController');
const router = express.Router();
const upload = require('../utils/multer');

router.route('/update').patch(updateUser);
router.route('/:userId/upload').patch(upload.single('uploadedCV'), uploadDocument);

module.exports = router;