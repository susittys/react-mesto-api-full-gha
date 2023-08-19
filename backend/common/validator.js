import { celebrate, Joi } from 'celebrate';
import { regexEmail, regexUrl } from '../utils/constants.js';

export default () => {
  // проверка почты
  const checkEmail = (email) => String(email)
    .toLowerCase()
    .match(regexEmail);

  // проверка аватара
  const checkImgURL = (url) => String(url)
    .toLowerCase()
    .match(regexUrl);

  const loginUserValidator = celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });

  const createUserValidator = celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regexUrl),
    }),
  });

  const createCardValidator = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(regexUrl),
    }),
  });

  const updUserInfoValidator = celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  });

  const updUserAvatarValidator = celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(regexUrl),
    }),
  });

  const checkId = celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  });

  return {
    checkId,
    checkEmail,
    checkImgURL,
    loginUserValidator,
    createUserValidator,
    createCardValidator,
    updUserInfoValidator,
    updUserAvatarValidator,
  };
};
