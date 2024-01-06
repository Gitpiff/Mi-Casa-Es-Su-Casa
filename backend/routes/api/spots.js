const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const router = express.Router();

//Get All Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll()

    return res.json({
        spots
    })
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    const currentUserSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })

    return res.json({
        currentUserSpots
    })
});

module.exports = router;
