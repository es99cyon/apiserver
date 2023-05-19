const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('실행이 된다는걸 알겠dddddd어');
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Get user with id ${userId}`);
});

router.post('/', (req, res) => {
  const userData = req.body;
  res.send(`Create new user with data ${JSON.stringify(userData)}`);
});

module.exports = router;