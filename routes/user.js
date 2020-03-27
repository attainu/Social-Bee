const express = require('express');
const User = require('../models/user_models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  //To create a new USER

  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  //login after REGISTRATION

  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res.status(401).send({
        error:
          'Login unsuccessful,Please check Authentication details and try Again'
      });
    }

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
