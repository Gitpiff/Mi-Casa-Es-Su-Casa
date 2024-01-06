const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const Review = require('../../db/models/review');
const Spotimage = require('../../db/models/spotimage');

const router = express.Router();

//Get All Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: Spotimage
            }
        ]
    })

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

//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    //console.log(spotId)
    try {
        const spot = await Spot.findByPk(parseInt(spotId));

        if(!spot) return res.status(404).json(
            {
                message: "Spot couldn't be found"
              }
        )

        return res.json({
            spot
        })
    } catch(error) {
        console.log(error)
    }
});

module.exports = router;
