require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => {
      if (!users) {
        const err = new Error('Ocorreu um erro ao buscar usuários');
        err.statusCode = 500;
        throw err;
      }
      res.send({ data: users });
    })
    .catch(next);
}

function getUserById(req, res, next) {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => {
      const err = new Error('Usuário não encontrado');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
}

function getUserMe(req, res, next) {
  const { user } = req;
  return User.findById(user._id)
    .orFail(() => {
      const err = new Error('Usuário não encontrado');
      err.statusCode = 404;
      throw err;
    })
    .then((userData) => {
      res.send({ data: userData });
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;
  try {
    if (!email || !password) {
      const err = new Error('Dados inválidos...');
      err.statusCode = 400;
      throw err;
    }
  } catch (error) {
    next(error);
  }

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
}

function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;
  const userUpdated = {};

  try {
    if (!name && !about) {
      const err = new Error('Dados inválidos...');
      err.statusCode = 400;
      throw err;
    }
  } catch (error) {
    next(error);
  }

  if (name) {
    userUpdated.name = name;
  }
  if (about) {
    userUpdated.about = about;
  }

  return User.findByIdAndUpdate(userId, userUpdated, {
    new: true,
  })
    .orFail(() => {
      const err = new Error('Usuário não encontrado');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
}

function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    if (!avatar) {
      const err = new Error('Dados inválidos...');
      err.statusCode = 400;
      throw err;
    }
  } catch (error) {
    next(error);
  }

  return User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
    },
  )
    .orFail(() => {
      const err = new Error('Usuário não encontrado');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      const err = new Error('Dados inválidos...');
      err.statusCode = 400;
      throw err;
    }
  } catch (error) {
    next(error);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        {
          expiresIn: '7d',
        },
      );
      if (!token) {
        const err = new Error('Token inválido...');
        err.statusCode = 401;
        throw err;
      }
      res.send({ token });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUserById,
  getUserMe,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
