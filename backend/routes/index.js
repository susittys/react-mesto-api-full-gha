import { Router } from 'express';
import Errors from '../common/errors.js';
import Validator from '../common/validator.js';
import auth from '../middlewares/auth.js';

import users from './users.js';
import cards from './cards.js';

import { createUser, login } from '../controllers/users.js';

const rootRouter = Router();

const { createUserValidator, loginUserValidator } = Validator();
rootRouter.post('/signup', createUserValidator, createUser);
rootRouter.post('/signin', loginUserValidator, login);

rootRouter.use(auth);
rootRouter.use('/users', users);
rootRouter.use('/cards', cards);

const errors = Errors();
rootRouter.all('*', (err, req, next) => {
  next(errors.NotFound('Ресурс по вашему запросу не найден'));
});

export default rootRouter;
