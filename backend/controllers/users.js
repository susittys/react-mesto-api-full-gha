import mongoose from 'mongoose';
import escape from 'escape-html';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Error from '../common/errors.js';
import Validator from '../common/validator.js';
import User from '../models/user.js';

const { NODE_ENV, JWT_SECRET } = process.env;

const error = Error();
const { checkEmail } = Validator();

const handlerError = (res, err, next) => {
  if (err instanceof mongoose.Error.CastError) {
    next(error.BadRequest('Не корректные данные пользователя'));
  } else if (err.code === 11000) {
    next(error.existEmail('Такой email уже существует'));
  } else {
    next(err);
  }
};

function handlerResult(res, user, newRes = false) {
  if (!user) {
    throw error.NotFound('Некорректный ID пользователя');
  } else {
    res.status(newRes ? 201 : 200).send(user);
  }
}

const getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => handlerResult(res, users))
    .catch((err) => handlerError(res, err, next));
};

const getUserByID = (req, res, next) => {
  const idUser = req.params.id;

  User
    .findById(idUser)
    .then((user) => handlerResult(res, user))
    .catch((err) => handlerError(res, err, next));
};

// проверка на содержание и кодирование пароля
function hashedPassword(pass) {
  if (!pass) {
    throw error.BadRequest('Отсутствует пароль');
  }

  return bcrypt.hash(pass, 10);
}

function bodyParser(data, hash) {
  const result = {};

  const allowedKeys = ['name', 'about', 'avatar', 'email'];

  allowedKeys.forEach((key) => {
    if (data[key]) {
      result[key] = escape(data[key]);
    }
  });

  result.password = hash;

  return result;
}

const createUser = (req, res, next) => {
  if (!checkEmail(req.body.email)) error.BadRequest('Не корректный адрес электронной почты');

  hashedPassword(req.body.password)
    .then((hash) => User.create(bodyParser(req.body, hash)))
    .then(({
      _id, name, about, avatar, email,
    }) => handleResCookies(res, {
      _id, name, about, avatar, email,
    }, true))
    .catch((err) => handlerError(res, err, next));
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  const idUser = req.user._id;

  User
    .findByIdAndUpdate(idUser, { name, about }, { new: true, runValidators: true })
    .then((user) => handlerResult(res, user))
    .catch((err) => handlerError(res, err, next));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const idUser = req.user._id;

  User
    .findByIdAndUpdate(idUser, { avatar }, { new: true, runValidators: true })
    .then((user) => handlerResult(res, user))
    .catch((err) => handlerError(res, err, next));
};

const getUserMe = (req, res, next) => {
  const idUser = req.user._id;

  User
    .findById(idUser)
    .then(({_id, email, name, about, avatar}) => handlerResult(res, {_id, email, name, about, avatar}))
    .catch((err) => handlerError(res, err, next));
};

function handleResCookies(res, user) {
  const token = jwt.sign(
    { _id: user._id },
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
    { expiresIn: '7d' },
  );

  res
    .status(200)
    .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
    .send(user);
}

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) throw error.Unauthorized('Не найден пользователь или неверный пароль');

      const {_id, name, about, avatar, email} = user
      handleResCookies(res, {
        _id, name, about, avatar, email
      });
    })
    .catch((err) => {
      res.clearCookie('jwt');
      next(err);
    });
};

const logOut = (req, res, next) => {
  res
      .clearCookie('jwt')
      .status(200)
      .send({message: 'OK'})
}

export {
  login, getUsers, getUserMe, updateProfile, getUserByID, createUser, updateAvatar, logOut,
};
