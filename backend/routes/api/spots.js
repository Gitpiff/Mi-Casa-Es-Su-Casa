const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
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
        .custom(val => {
            if(val <= 0) {
                throw new Error('Price per day must be greater than 0')
            } else {
                return val
            }
        }),
        //.withMessage('Price per day must be greater than 0'),
        handleValidationErrors
];
const validateQuery = [
    check('page')
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1')
        .optional(),
    check('size')
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1')
        .optional(),
    check('minLat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Minimum latitude is invalid')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxLat;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum latitude cannot be greater than maximum latitude')
            }
        })
        .optional(),
    check('maxLat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Maximum latitude is invalid')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minLat;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum latitude cannot be less than minimum latitude')
            }
        })
        .optional(),
    check('minLng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Minimum longitude is invalid')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxLng;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum longitude cannot be greater than maximum longitude')
            }
        })
        .optional(),
    check('maxLng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Maximum longitude is invalid')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minLng;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum longitude cannot be less than minimum longitude')
            }
        })
        .optional(),
    check('minPrice')
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxPrice;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum price cannot be greater than maximum price')
            }
        })
        .optional(),
    check('maxPrice')
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minPrice;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum price cannot be less than minimum price')
            }
        })
        .optional(),
    handleValidationErrors
];

//Get All Spots
router.get('/', validateQuery, async (req, res) => {

    let { maxLat, minLat, minLng, maxLng } = req.query
    let page = Number(req.query.page)
    let size = Number(req.query.size)
    let minPrice = req.query.minPrice
    let maxPrice = req.query.maxPrice
    const results = {}

    const pagination = {}
    if (page || size) {
        if (page >= 1 && size >= 1) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
        }

        if (size > 20) size = 20
        if (page > 10) page = 10
    }

    const where = {};
    if (minLat && maxLat) {
        where.lat = {
            [Op.between]: [minLat, maxLat]
        }
    }

    if (minLat && !maxLat) {
        where.lat = {
            [Op.gte]: [minLat]
        }
    }

    if (maxLat && !minLat) {
        where.lat = {
            [Op.lte]: [maxLat]
        }
    }

    if (minLng && maxLng) {
        where.lng = {
            [Op.between]: [minLng, maxLng]
        }
    }

    if (minLng && !maxLng) {
        where.lng = {
            [Op.gte]: [minLng]
        }
    };

    if (maxLng && !minLng) {
        where.lng = {
            [Op.lte]: [maxLng]
        }
    };

    if (minPrice && maxPrice) {
        where.price = {
            [Op.between]: [minPrice, maxPrice]
        }
    }

    if (minPrice && !maxPrice) {
        where.price = {
            [Op.gte]: [minPrice]
        }
    };

    if (maxPrice && !minPrice) {
        where.price = {
            [Op.lte]: [maxPrice]
        }
    };

    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        where,
        ...pagination
    })

    let spotsList = [];

    spots.forEach(spot => {
        spotsList.push(spot.toJSON());
    });

    spotsList.forEach(spot => {

        spot.lat = Number.parseFloat(spot.lat);
        spot.lng = Number.parseFloat(spot.lng);
        spot.price = Number.parseFloat(spot.price);
        spot.avgRating = 'No reviews found';

        spot.Reviews.forEach(review => {

            if (review.stars) {
                let totalStars = spot.Reviews.reduce((sum, review) => (sum + review.stars), 0)
                avgStars = totalStars / spot.Reviews.length
                spot.avgRating = avgStars;
            }
        });

        spot.previewImage = "No preview images available";

        spot.SpotImages.forEach(image => {
            if (image.preview) {
                spot.previewImage = image.url
            }
        });

        delete spot.SpotImages;
        delete spot.Reviews;
    });

    if (spotsList.length === 0) return res.status(400).json({ message: "No spots found" });

    results.Spots = spotsList
    if (page) results.page = page;
    if (size) results.size = size;


    return res.json(results);
});



//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {

        const spots = await Spot.findAll({
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                    attributes: ['url', 'preview']
                }
            ],
            where: {
                ownerId: user.id
            }
        })


        let spotsList = [];

        spots.forEach(spot => {
            spotsList.push(spot.toJSON());
        });

        spotsList.forEach(spot => {

            spot.lat = Number.parseFloat(spot.lat);
            spot.lng = Number.parseFloat(spot.lng);
            spot.price = Number.parseFloat(spot.price);
            spot.avgRating = 'No reviews found'

            spot.Reviews.forEach(review => {
                if (review.stars) {
                    let totalStars = spot.Reviews.reduce((sum, review) => (sum + review.stars), 0)
                    avgStars = totalStars / spot.Reviews.length
                    spot.avgRating = avgStars;
                }
            });

            // if (!spot.avgRating) {
            //     spot.avgRating = "No ratings available"
            // };

            spot.previewImage = "No preview images available";

            spot.SpotImages.forEach(image => {
                if (image.preview) {
                    spot.previewImage = image.url
                }
            });

            delete spot.SpotImages;
            delete spot.Reviews;
        });

        if (spotsList.length === 0) {
            return res.json({ Spots: "No spots found" })
        } else {
            return res.json({ Spots: spotsList });
        }

    }
});




//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
   const spotId = Number(req.params.spotId);

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
                ownerId: +spot.ownerId,
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
                avgStarRating: spot.Reviews.length === 0 ? 'No reviews found' : total / spot.Reviews.length,
                SpotImages: spot.SpotImages.length !== 0 ? spot.SpotImages : "No spot images found",
                Owner: spot.User
            }
            return res.json(spotObj)
         }
        
    } catch(error) {
        console.log(error)
    }
});




//Create a spot
router.post('/', requireAuth, validateSpot, async  (req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.create({
        ownerId: +user.id,
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

    newSpot.lat = Number(newSpot.lat);
    newSpot.lng = Number(newSpot.lng);
    newSpot.price = Number(newSpot.price);

    return res.json(newSpot)
});




//Add Image to a post based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body;
    const { spotId } = req.params;
    const userId = Number(req.user.id);
    let spot = await Spot.findByPk(spotId);

    if(!(await Spot.findByPk(spotId))) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };
    

    const newImage = await SpotImage.create({
        spotId: spotId,
        url: url,
        preview: preview
    });

    const image = {};

    image.id = newImage.id;
    image.url = newImage.url;
    image.preview = newImage.preview;

    return res.json(image);
});


//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const userId = Number(req.user.id);
    let spot = await Spot.findByPk(spotId);
   
    if (!user) {
        return res.status(401).json({
            message: "Authentication required"
        })
    };

    if(!(await Spot.findByPk(spotId))) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };
    
    
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
    const { spotId } = req.params
    const userId = +req.user.id
    let validSpot = await Spot.findByPk(spotId)

    if (!validSpot) return res.status(404).json({
        message: "Spot couldn't be found"
    })
    if (validSpot.ownerId !== userId) {
       return res.status(403).json({
            message: "Forbidden"
        })
    };
    await Spot.destroy({
        where: { id: spotId }
    })
    return res.json({
        message: "Successfully deleted"
    });
});


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    const spotId = Number(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
            }
        ]
    });

    const reviewsList = [];

    reviews.forEach(review => {
        reviewsList.push(review.toJSON());
    });

    reviewsList.forEach(review => {

        if (review.ReviewImages.length === 0)
            review.ReviewImages = "No review images found"
    });

    if (reviewsList.length === 0) {
        return res.json({ Reviews: "No reviews found" })
    } else {
        return res.json({ Reviews: reviewsList });
    }

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
    if (!user) {
        return res.status(401).json({
            message: "Authentication required"
        })
    }

    const { review, stars } = req.body

    const spotId = Number(req.params.spotId)

    const spot = await Spot.findOne({
        where: { id: spotId },
        include: [
            {
                model: Review,
                attributes: ['userId']
            }
        ]
    })

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    try {
        let errors = [];

        spot.Reviews.forEach(review => {
            if (review.userId === user.id) {
                const err = new Error("User already has a review for this spot")
                errors.push(err)
            }
        })

        if (errors.length) {
            return res.status(500).json({
                message: "User already has a review for this spot"
            })
        }

        const newReview = await Review.create({ userId: user.id, spotId, review, stars })
        res.status(201).json(newReview)

    } catch (error) {
        error.message = "Bad Request"
        error.status = 400
        next(error)
    }

});


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const spotId = Number(req.params.spotId);
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId);

    if (!(await Spot.findByPk(spotId))) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
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
    if(spot.ownerId === userId) {
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
        };

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
