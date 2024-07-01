const Card = require('../models/card');

function getCards(req, res) {
  return Card.find({})
    .then((cards) => {
      if (!cards) {
        const err = new Error('Ocorreu um erro ao buscar cards');
        err.status = 500;
        throw err;
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      console.log('getCards Error:', err);
      res.status(err.status).send({ error: err.message });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ error: 'Dados inválidos...' });
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
        err.status = 500;
        throw err;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      console.log('createCard Error:', err);
      res.status(err.status).send({ error: err.message });
    });
}

function deleteCardById(req, res) {
  const { cardId } = req.params;
  return Card.deleteOne({ _id: cardId })
    .orFail(() => {
      const err = new Error('Erro ao deletar este card');
      err.status = 400;
      throw err;
    })
    .then(() => {
      res.send({ message: 'Card deletado com sucesso' });
    })
    .catch((err) => {
      console.log('deleteCardById Error:', err);
      res.status(err.status).send({ error: err.message });
    });
}

function likeCard(req, res) {
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
      err.status = 404;
      throw err;
    })
    .then(() => {
      res.send({ message: 'Like com sucesso' });
    })
    .catch((err) => {
      console.log('likeCard Error:', err);
      res.status(err.status).send({ error: err.message });
    });
}

function dislikeCard(req, res) {
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
      err.status = 404;
      throw err;
    })
    .then(() => {
      res.send({ message: 'Dislike com sucesso' });
    })
    .catch((err) => {
      console.log('dislikeCard Error:', err);
      res.status(err.status).send({ error: err.message });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
