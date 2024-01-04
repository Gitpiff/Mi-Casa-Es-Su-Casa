//This file will hold the resources for the route paths beginning with /api/users
const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

//Validate Signup Request Body
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email'),
     check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password is required'),
  handleValidationErrors
]

// Sign up
router.post(
    '/',
    validateSignup,     //Validator middleware
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, firstName, lastName, hashedPassword });

  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
);

module.exports = router;

