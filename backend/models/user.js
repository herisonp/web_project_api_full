const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Insira um email válido.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?(www\.)?[\w\-._~]+(\.[a-zA-Z]{2,})(:\d+)?(\/[\w\-._~:/?%#[@\]!$&'()*+,;=]*)?(#)?$/.test(
          v,
        );
      },
      message: 'Link inválido',
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      const err = new Error('Senha ou e-mail incorreto');
      err.statusCode = 400;
      if (!user) {
        return Promise.reject(err);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(err);
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
