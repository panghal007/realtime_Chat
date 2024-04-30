const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Handle signup form submission
router.post('/signup', userController.signup);

// Handle login form submission
router.post('/login', userController.login);
router.get('/getusers', userController.getUser);
router.get('/messages/:senderId/:recipientId', userController.getMessages);
router.get('/:userId/status', userController.getUserStatus);
router.put('/:userId/status', userController.updateUserStatus);
module.exports = router;