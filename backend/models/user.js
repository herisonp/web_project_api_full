const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?(www\.)?[\w\-._~]+(\.[a-zA-Z]{2,})(:\d+)?(\/[\w\-._~:/?%#[@\]!$&'()*+,;=]*)?(#)?$/.test(
          v,
        );
      },
      message: 'Link inválido',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
