const Router = require('express');
const router = new Router();
const { register, login, getUsers } = require('./authController');
const { check } = require('express-validator');
const authMiddleware = require('./middleWare/authMiddleWare');
const roleMiddleWare = require('./middleWare/roleMiddleware');

router.post('/register', register, [
  check('username', 'username cannot be empty').notEmpty(),
  check(
    'password',
    'password should be at least 4 signs and maximum 10'
  ).isLength({ min: 4, max: 10 }),
]);
router.post('/login', login);
router.get('/users', roleMiddleWare(['user']), getUsers);

module.exports = router;
