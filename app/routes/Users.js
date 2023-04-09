const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/UserController');

const router = express.Router();

router.get('/api/acount', getUsers);
router.get('/api/acount/:id', getUser);
router.post('/api/acount', createUser);
router.put('/api/acount/:id', updateUser);
router.delete('/api/acount/:id', deleteUser);

module.exports = router;