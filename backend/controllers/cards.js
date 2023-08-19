import mongoose from 'mongoose';
import escape from 'escape-html';
import Error from '../common/errors.js';
import Validator from '../common/validator.js';
import Card from '../models/card.js';

const error = Error();
const { checkImgURL } = Validator();

const handlerError = (res, err, next) => {
  if (err instanceof mongoose.Error.CastError || err.name === 'ValidationError') {
    next(error.BadRequest('Некорректный данные карточки'));
  } else {
    next(err);
  }
};

function handlerResult(res, card, newRes = false) {
  if (!card) {
    throw error.NotFound('Данной карточки не существует');
  } else {
    res.status(newRes ? 201 : 200).send(card);
  }
}

const getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => handlerResult(res, cards))
    .catch((err) => handlerError(res, err, next));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  if (!checkImgURL(link)) throw error.BadRequest('Не корректно указана ссылка');

  const newCard = {
    name: escape(name),
    link,
    owner,
  };
  Card
    .create(newCard)
    .then((card) => handlerResult(res, card, true))
    .catch((err) => handlerError(res, err, next));
};

const deleteCard = (req, res, next) => {
  const idCard = req.params.id;
  const idUser = req.user._id;

  Card
    .findById(idCard)
    .populate('owner')
    .then((card) => {
      if (!card) throw error.NotFound('Карточка не найдена');

      if (card.owner._id.toString() !== idUser) throw error.Forbidden('Недостаточно прав');

      Card.deleteOne(card)
        .then(() => {
          Card
            .find({ owner: idUser })
            .populate(['owner', 'likes'])
            .then((data) => handlerResult(res, data));
        });
    })
    .catch((err) => handlerError(res, err, next));
};

const setLikeCard = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw error.BadRequest('Не правильно указан ID карточки');
  Card
    .findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => error.NotFound('Карточка не найдена'))
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
    .orFail(() => error.NotFound('Карточка не найдена'))
    .populate(['owner', 'likes'])
    .then((card) => handlerResult(res, card))
    .catch((err) => handlerError(res, err, next));
};

export {
  getCards, createCard, deleteCard, setLikeCard, unsetLikeCard,
};
