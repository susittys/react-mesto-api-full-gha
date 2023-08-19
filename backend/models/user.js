import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import isEmail from 'validator/lib/isEmail.js';
import isURL from 'validator/lib/isURL.js';
import Error from '../common/errors.js';

const error = Error();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: isURL,
    },
  },
  email: {
    type: String,
    validate: {
      validator: isEmail,
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw error.Unauthorized('Не найден пользователь с данным ID');

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw error.Unauthorized('Не верные почта или пароль');

          return user;
        });
    });
};

export default mongoose.model('user', userSchema);
