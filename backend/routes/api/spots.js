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

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Price per day is required')
        .isFloat({ min: 0 })
        .withMessage('Price per day must be greater than 0'),
        handleValidationErrors
];

//Get All Spots
router.get('/', async (req, res) => {
        const spots = await Spot.findAll({
           include: [ 
            { 
                model: Review
            }, 
            { 
                model: SpotImage,
                where: {
                    preview: true
                }
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

//Create a spot
router.post('/', requireAuth, async  (req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    return res.json(newSpot)

});

//Add Image to a post based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    //Find spot
    const spot = await Spot.findByPk(spotId);
    console.log(spot)

    if(!spot) {
        res.status(404).json(
            {
                message: "Spot couldn't be found"
            }
        )
    } else {
        const newImage = await SpotImage.create({
            spotId: spot.id,
            url,
            preview
        })

        return res.json({id: newImage.id, url: newImage.url, preview: newImage.preview})
        //return res.json(newImage)
    }
});


//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        res.status(404).json(
            {
                message: "Spot could not be found"
            }
        )
    }

   spot.set({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
   });

   await spot.save();

   return res.json(spot)

});


//Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        res.status(404).json(
            {
                message: "Spot couldn't be found"
            }
        )
    }

    await spot.destroy();

    return res.status(200).json(
        {
            message: "Successfully deleted"
        }
    )
});

module.exports = router;
