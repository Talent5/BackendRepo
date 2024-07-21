const express = require('express');

const { updateUser } = require('../controller/userController');
const router = express.Router();

router.route('/update').patch(updateUser);

module.exports = router;