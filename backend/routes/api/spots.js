const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');

const router = express.Router();

//Get All Spots
router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll({
            attributes: [
                'id', 
                'ownerId', 
                'address', 
                'city', 
                'state', 
                'country', 
                'lat', 
                'lng', 
                'name', 
                'description', 
                'price', 
                'createdAt', 
                'updatedAt', 
                //'avgRating', 
                //'previewImage' 
            ]
        });

        res.json({spots});

    } catch(error) {
        console.log(error);
    };
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    const Spots = await Spot.findAll({
        attributes: [
            'id', 
            'ownerId', 
            'address', 
            'city', 
            'state', 
            'country', 
            'lat', 
            'lng', 
            'name', 
            'description', 
            'price', 
            'createdAt', 
            'updatedAt', 
            //'avgRating', 
            //'previewImage' 
        ],
        where: {
            ownerId: user.id
        }
    })

    return res.json({
        Spots
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
