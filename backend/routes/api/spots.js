const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, ReviewImage, Booking, User } = require('../../db/models');

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
                },
                required: false //prevents inner join
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
    });
    const spotObj = {};
    const spotsList = [];

    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    });

    spotsList.forEach(spot => {
        spot.lat = Number(spot.lat);
        spot.lng = Number(spot.lng);
        spot.price = Number(spot.price);

        let total = 0;
        spot.Reviews.forEach(review => {
            total += review.stars;
        });
        spot.avgRating = total / spot.Reviews.length;
        delete spot.Reviews;

        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
        });
        delete spot.SpotImages;
    });

    spotObj.Spots = spotsList;

    return res.json(spotObj)
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


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if(!spot) {
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            }
        )
    };

    const spotReviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const Reviews = [];

    spotReviews.forEach(review => {
        Reviews.push(review.toJSON())
    });

    return res.json(Reviews)

});

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .custom(async val => {
            if (!val || val < 1 || val > 5) {
                throw new Error('Stars must be an integer from 1 to 5')
            }
        }),
    handleValidationErrors
];



//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const { user } = req;
    const { review, stars } = req.body;
    const errRes = {};

    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review
            }
        ]
    });

    if(!spot) {
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            }
        )
    };

    spot.Reviews.forEach(review => {
        if (review.userId === user.id) {
            errRes.message = 'User already has a review for this spot';
        }
    });

    if (Object.entries(errRes).length) {
        return res.status(500).json(errRes);
    };

    const newReview = await Review.create({
        userId: user.id,
        spotId: spot.id,
        review,
        stars
    })

    return res.json(newReview);
});


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const spotId = Number(req.params.spotId);
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        return res.status(404).json(
            {
                message: "Spot couldn't be found"
            }
        )
    };

    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        },
        include: [
            {
                model: User
            }
        ]
    });

    let bookingList = [];
    let userBookings = {};


    //If you are the owner of the spot
    if(userId === spot.ownerId) {
        bookings.forEach(booking => {
            bookingList.push(
                userBookings = {
                    User : {
                        id: booking.User.id,
                        firstName: booking.User.firstName,
                        lastName: booking.User.lastName
                    },
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                }
            )
        })
    } else {    //If you are NOT the owner of the spot
        bookings.forEach(booking => {
            bookingList.push(
                userBookings = {
                    spotId: booking.spotId,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                }
            )
        })
    };

   return res.json(
    {
        Bookings: bookingList
    }
   )
});


const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .custom(async (value, { req }) => {
            const date = new Date(value);
            const today = new Date();
            if (date < today) {
                throw new Error('startDate cannot be in the past')
            }
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom(async (value, { req }) => {
            const start = new Date(req.body.startDate)
            const end = new Date(value);
            if (end <= start) {
                throw new Error('endDate cannot be on or before startDate')
            }
        }),
    handleValidationErrors
];


//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const { user } = req;

        if (!user) {
            return res.status(401).json({
                message: "Authentication required"
            })
        }

        const { startDate, endDate } = req.body;

        if (!startDate || !endDate || (startDate >= endDate)) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    endDate: "endDate cannot be on or before startDate"
                }
            })
        }

        const spotId = Number(req.params.spotId)

        const spot = await Spot.findOne({
            where: { id: spotId },
            include: [
                {
                    model: Booking,
                    attributes: ['startDate', 'endDate']
                }
            ]
        })

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        if (spot.ownerId === user.id) return res.status(403).json({
            message: "Forbidden"
        })

        let newStartDate = new Date(startDate).getTime()
        let newEndDate = new Date(endDate).getTime()

        const existingBooking = await Booking.findAll({
            where: {
                spotId: spotId
            }
        })

        let errors = [];
        existingBooking.forEach(booking => {

            let currStartDate = booking.startDate.getTime()
            let currEndDate = booking.endDate.getTime()

            if ((newStartDate === currStartDate && newEndDate === currEndDate) ||
                (newStartDate > currStartDate && newEndDate < currEndDate) ||
                (newStartDate < currStartDate && newEndDate > currEndDate)) {
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403
                err.errors = {
                    startDate: "startDate conflicts with an existing booking",
                    endDate: "endDate conflicts with an existing booking"
                }
                errors.push(err)
                next(err)
            }

            if (newStartDate === currStartDate || newStartDate === currEndDate ||
                (newStartDate >= currStartDate && newStartDate <= currEndDate)) {
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403
                err.errors = {
                    startDate: "startDate conflicts with an existing booking"
                }
                errors.push(err)
                next(err)
            }

            if (newEndDate === currStartDate || newEndDate === currEndDate ||
                (newEndDate >= currStartDate && newEndDate <= currEndDate)) {
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403
                err.errors = {
                    endDate: "endDate conflicts with an existing booking"
                }
                errors.push(err)
                next(err)
            }
        })

        if (!errors.length) {

            let newBooking = {};

            const booking = await Booking.create({ userId: user.id, spotId, startDate, endDate })

            newBooking.id = booking.id
            newBooking.spotId = spotId
            newBooking.userId = user.id
            newBooking.startDate = booking.startDate
            newBooking.endDate = booking.endDate
            newBooking.createdAt = booking.createdAt
            newBooking.updatedAt = booking.updatedAt

            return res.status(200).json(newBooking)
        }
});



module.exports = router;
