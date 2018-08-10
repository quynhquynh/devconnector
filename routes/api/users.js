const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// @route   GET api/users/register
// desc     Register
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  
  if(!isValid){
      return res.status(400).json(errors)
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
        errors.email = 'Email already exists'
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm' //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(e => console.log(e));
        });
      });
    }
  });
});

// @route   GET api/users/LOGIN
// desc     Login /return JWT token
// @access  Public

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const { errors, isValid } = validateLoginInput(req.body)
  
  if(!isValid){
      return res.status(400).json(errors)
  }

  User.findOne({ email }).then(user => {
    if (!user) {
        errors.email = 'User not found'
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
          const { id, name, avatar} = user
          const payload = {
              id, name, avatar //decode token will show this
          }
          //Sign token
        jwt.sign(payload, keys.secretOrKey, {expiresIn: 36000}, (err, token) => {
            res.json({
                success: true,
                token: 'Bearer ' + token
            })
        })
      } else {
          errors.password = 'Password incorrect'
        return res.status(400).json(errors);
      }
    });
  });
});

//from user/login -> passport return done(null, user) -> get { id, name, email } from user

// @route   GET api/users/current
// desc     return current user
// @access  Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id, name, email } = req.user
    res.json({
        id, name, email
    })
})

module.exports = router;
