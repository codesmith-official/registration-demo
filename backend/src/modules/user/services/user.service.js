const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const SALT_ROUNDS = 10;

const findById = async (id) => {
  return User.findByPk(id);
};

const findByEmail = async (email, scope = 'fetchData') => {
  return scope === 'auth'
    ? User.scope('withPassword').findOne({ where: { email } })
    : User.findOne({ where: { email } });
};

const createUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

  return User.create({
    email: payload.email,
    password: hashedPassword,
    name: payload.name,
    role: payload.role || 'user',
  });
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  findById,
  findByEmail,
  createUser,
  comparePassword,
};
