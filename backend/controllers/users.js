import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import WrongDataError from '../errors/WrongDataError.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';

const { NODE_ENV, JWT_SECRET } = process.env;

const handlerError = (res, err, next) => {
  if (err instanceof mongoose.Error.CastError) {
    next(new WrongDataError('Не корректные данные пользователя'));
  } else if (err.code === 11000) {
    next(new ConflictError('Такой email уже существует'));
  } else {
    next(err);
  }
};

function handlerResult(res, user, newRes = false) {
  res.status(newRes ? 201 : 200).send(user);
}

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
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => handlerResult(res, user))
    .catch((err) => handlerError(res, err, next));
};

const hashedPassword = (pass) => bcrypt.hash(pass, 10);

const createUser = (req, res, next) => {
  hashedPassword(req.body.password)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
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
    .then(({
      _id, email, name, about, avatar,
    }) => handlerResult(res, {
      _id, email, name, about, avatar,
    }))
    .catch((err) => handlerError(res, err, next));
};

const login = (req, res, next) => User.findUserByCredentials({
  email: req.body.email,
  password: req.body.password,
})
  .then((user) => {
    const {
      _id, name, about, avatar, email,
    } = user;
    handleResCookies(res, {
      _id, name, about, avatar, email,
    });
  })
  .catch(next);

// eslint-disable-next-line no-unused-vars
const logOut = (req, res, next) => {
  res
    .clearCookie('jwt')
    .status(200)
    .send({ message: 'OK' });
};

export {
  login, getUsers, getUserMe, updateProfile, getUserByID, createUser, updateAvatar, logOut,
};
