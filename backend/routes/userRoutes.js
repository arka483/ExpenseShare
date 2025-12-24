const express = require('express');
const router = express.Router();
const { registerUser, getUsers, loginUser } = require('../controllers/userController');

router.route('/').post(registerUser).get(getUsers);
router.route('/login').post(loginUser);

module.exports = router;
