import mongoose from 'mongoose';
import escape from 'escape-html';
import Card from '../models/card.js';
import isURL from "validator/lib/isURL.js";
import WrongDataError from "../errors/WrongDataError.js";
import NotFoundError from "../errors/NotFoundError.js"
import ForbiddenError from "../errors/ForbiddenError.js";

const handlerError = (res, err, next) => {
  if (err instanceof mongoose.Error.CastError || err.name === 'ValidationError') {
    next( new WrongDataError('Некорректный данные карточки') );
  } else {
    next(err);
  }
};

const handlerResult = (res, data, newRes = false) => {
    res.status(newRes ? 201 : 200).send(data);
}

const getCards = (req, res, next) => {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .sort({ _id: -1 })
    .then((cards) => handlerResult(res, cards))
    .catch((err) => handlerError(res, err, next));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  if ( !isURL(link) ) next( new WrongDataError('Не корректная ссылка') );

  const newCard = {
    name: escape(name),
    link,
    owner,
  };
  Card
    .create(newCard)
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => handlerResult(res, card, true))
    .catch((err) => handlerError(res, err, next));
};

const deleteCard = (req, res, next) => {
  const idCard = req.params.id;
  const idUser = req.user._id;

  Card
    .findById(idCard)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) next( new NotFoundError('Карточка не найдена') );

      if (card.owner._id.toString() !== idUser) next( new ForbiddenError('Недостаточно прав') );

      return card.deleteOne({_id: card._id})
    })
    .then((data) => handlerResult(res, data))
    .catch((err) => handlerError(res, err, next))
};

const setLikeCard = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) next( new WrongDataError('Не правильно указан ID карточки') );

  Card
    .findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => next( new NotFoundError('Карточка не найдена') ) )
    .populate(['owner', 'likes'])
    .then((card) => handlerResult(res, card))
    .catch((err) => handlerError(res, err, next));
};

const unsetLikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => next( new NotFoundError('Карточка не найдена') ) )
    .populate(['owner', 'likes'])
    .then((card) => handlerResult(res, card))
    .catch((err) => handlerError(res, err, next));
};

export {
  getCards, createCard, deleteCard, setLikeCard, unsetLikeCard,
};
