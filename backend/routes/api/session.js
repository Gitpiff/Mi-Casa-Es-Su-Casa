// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();


// Restore session user
router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);

//Validates Login Request Body 
const validateLogin = [
  check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Email or username is required'),
  check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
  //handleValidationErrors
];


// Log in
router.post(
    '/',
    validateLogin,  //Validator middleware
    async (req, res, next) => {
      const { credential, password } = req.body; //Credential can be username || email
  
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {    //or - || - validator, if either of them matches the credential retrieve user
            username: credential,
            email: credential
          }
        }
      });

      if(!credential || !password) {
        return res.status(400).json({
          message: 'Bad Request',
          errors: {
            credential: "Email or username is required",
            password: "Password is required"
          }
        })
      }
  
      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        return res.status(401).json({
          message: 'Invalid credentials'
        })
      }
      //NEVER SEND PASSWORD 
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


// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
);


module.exports = router;