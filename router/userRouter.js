const express = require('express');

const { updateUser, uploadDocument } = require('../controller/userController');
const router = express.Router();

router.route('/update').patch(updateUser);
router.route('/:userId/upload').patch(uploadDocument);

module.exports = router;