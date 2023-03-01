const Router = require('express');
const router = new Router();
const { register, login, getUsers } = require('./authController');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);

module.exports = router;
