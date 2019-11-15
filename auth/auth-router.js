const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('./auth-model');

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(500).json(err))
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {

        const token = getJwtToken(user.username);

        res.status(200).json({
          message: `Hi ${user.username}, have a token.`,
          token
        })
      } else {
        res.status(401).json({ message: 'You Shall Not Pass!' });
      }
    })
    .catch(err => res.status(500).json(err));
});

function getJwtToken(user) {
  const payload = { 
    subject: user.id,  
    username: user.username
 };

  const secret = process.env.JWT_SECRET || 'is it secret, is it safe?';

  const options = { expiresIn: '1d' };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
