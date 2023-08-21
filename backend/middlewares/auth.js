import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError.js';

const { NODE_ENV, JWT_SECRET } = process.env;

export default (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key');
  } catch (e) {
    next(new UnauthorizedError('Не верные почта или пароль'));

    return;
  }

  req.user = payload;
  next();
};
