const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { User } = require('../../db/models');


const router = express.Router();

//Get All Spots
router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll({
           include: [
                {
                    model: Review
                },
                {
                    model: SpotImage
                }
           ]
        });

        let Spots = [];

        spots.forEach(spot => {
            Spots.push(spot.toJSON())   //Conver to JSON so we can add attributes
        });

        Spots.forEach(spot => {
            let total = 0;

            spot.Reviews.forEach(review => {
                total += review.stars;
            });

         spot.avgRating = total / spot.Reviews.length;  
         delete spot.Reviews;   //Keeps it from showing in the res.json
         
         //previewImage
         spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
        });   
        delete spot.SpotImages;
            
        });

        res.json({Spots});

    } catch(error) {
        console.log(error);
    };
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    const spots = await Spot.findAll({
       
        where: {
            ownerId: user.id
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    let Spots = [];

    spots.forEach(spot => {
        Spots.push(spot.toJSON())   //Conver to JSON so we can add attributes
    });

    Spots.forEach(spot => {
        let total = 0;

        spot.Reviews.forEach(review => {
            total += review.stars;
        });

     spot.avgRating = total / spot.Reviews.length;  
     delete spot.Reviews;
     
     //previewImage
     spot.SpotImages.forEach(image => {
        if (image.preview === true) {
            spot.previewImage = image.url
        }
    });   
    delete spot.SpotImages;
        
    });

    res.json({Spots});
});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
   const { spotId } = req.params;

    console.log(spotId)
    try {
        const spot = await Spot.findByPk(parseInt(spotId), {
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ],
        });

        if(!spot) return res.status(404).json(
            {
                message: "Spot couldn't be found"
              }
        )
         else {
            let total = 0;
            spot.Reviews.forEach(review => {
                total += review.stars;
            });

            const spotObj = {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: Number(spot.lat),
                lng: Number(spot.lng),
                name: spot.name,
                description: spot.description,
                price: Number(spot.price),
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                numReviews: await spot.countReviews(),
                avgStarRating: total / spot.Reviews.length,
                SpotImages: spot.SpotImages,
                Owner: spot.User
            }
            return res.json(spotObj)
         }
        
    } catch(error) {
        console.log(error)
    }
});

module.exports = router;
