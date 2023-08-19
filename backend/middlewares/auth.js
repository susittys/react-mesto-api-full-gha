import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Error from '../common/errors.js';

const { NODE_ENV, JWT_SECRET } = process.env;

const error = Error();

export default (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) throw error.Unauthorized('Не верные почта или пароль');

  const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key');

  User.findById(payload._id)
    .then((user) => {
      if (!user) throw error.NotFound('Не найден пользователь с данным ID');

      req.user = payload;
      next();
    })
    .catch(next);
};
