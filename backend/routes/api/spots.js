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
    //const spots = await Spot.findAll();
    const spots = await Spot.findAll({
        include: { model: SpotImage }
        //If spotImage.preview is true, then create/append a new attribute
        //called previewImage with the value of the url of said image
    })

    //Store each spot into an array so we can add attributes -avgRating & previewImage-
    let spotList = []; 

    spots.forEach(spot => {
        spotList.push(spot.toJSON())
    });

    console.log(spotList);

    spotList.forEach(spot => {
        spot.SpotImage.forEach(image => {
            if(image.preview) {
                spot.previewImage = image.url
            }
        })
    });

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
