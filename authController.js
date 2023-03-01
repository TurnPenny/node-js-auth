const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'registration error' });
      }
      const { username, password } = req.body;
      const candidate = User.findOne({ username });
      // if (candidate) {
      //   return res
      //     .status(400)
      //     .json({ message: `'User with this name already exists'` });
      // }
      const hashedPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: 'user' });
      const user = new User({
        username,
        password: hashedPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: 'user successfully registered' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `user ${user} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        res.status(400).json({ message: 'password is wrong' });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'login error' });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {}
  }
}

module.exports = new authController();

// const userRole = new Role();
// const adminRole = new Role({ value: 'admin' });
// await userRole.save();
// await adminRole.save();
