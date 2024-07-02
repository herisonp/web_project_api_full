const Card = require('../models/card');

function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => {
      if (!cards) {
        const err = new Error('Ocorreu um erro ao buscar cards');
        err.statusCode = 500;
        throw err;
      }
      res.send({ data: cards });
    })
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  try {
    if (!name || !link) {
      const err = new Error('Dados inválidos...');
      err.statusCode = 500;
      throw err;
    }
  } catch (error) {
    next(error);
  }

  const newCard = {
    name,
    link,
    owner: req.user._id,
  };

  return Card.create(newCard)
    .then((card) => {
      if (!card) {
        const err = new Error('Ocorreu um erro ao criar card');
        err.statusCode = 500;
        throw err;
      }
      res.send({ data: card });
    })
    .catch(next);
}

function deleteCardById(req, res, next) {
  const { cardId } = req.params;
  const { user } = req;
  return Card.findOneAndDelete({ _id: cardId, owner: user._id })
    .orFail(() => {
      const err = new Error('Erro ao deletar este card');
      err.statusCode = 401;
      throw err;
    })
    .then(() => {
      res.send({ message: 'Card deletado com sucesso' });
    })
    .catch(next);
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .orFail(() => {
      const err = new Error('Card não encontrado');
      err.statusCode = 404;
      throw err;
    })
    .then(() => {
      res.send({ message: 'Like com sucesso' });
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  return Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .orFail(() => {
      const err = new Error('Card não encontrado');
      err.statusCode = 404;
      throw err;
    })
    .then(() => {
      res.send({ message: 'Dislike com sucesso' });
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
