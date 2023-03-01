const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcrypt');

class authController {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const candidate = User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'User with this name already exists' });
      }
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
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'login error' });
    }
  }
  async getUsers(req, res) {
    try {
      const userRole = new Role();
      const adminRole = new Role({ value: 'admin' });
      await userRole.save();
      await adminRole.save();
      res.json('server works');
    } catch (e) {}
  }
}

module.exports = new authController();
