const express = require('express');
const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            { 
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                // attributes: {
                //     exclude: ['description', 'createdAt', 'updatedAt']
                // }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const Reviews = [];

    reviews.forEach(review => {
        Reviews.push(review.toJSON())
    });

    Reviews.forEach(review => {
        review.ReviewImages.forEach(image => {
            if(image.preview === true) {
                review.Spot.previewImage = image.url
            }
        });
        delete review.Spot.SpotImage;
        //console.log(review.ReviewImages)

    });

    res.json(Reviews)
});


//Add an Image to a Review based on the Review's id
router.post('/:reviewId/image', requireAuth, async(req, res, next) => {
    const { url } = req.body;
    const reviewId = Number(req.params.reviewId);

    const review = await Review.findByPk(reviewId, {
        include: [
            {
                model: ReviewImage
            }
        ]
    });

    const max = await review.countReviewImages();

    if(max >= 10) {
        return res.status(403).json(
            {
                message: 'Maximum number of images for this resource was reached'
            }
        )
    };

    const newImage = await ReviewImage.create({
        reviewId: review.id,
        url
    });

    return res.json({id: newImage.reviewId, url: newImage.url})
});


//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async(req, res, next) => {
    const reviewId = Number(req.params.reviewId);
    const review = await Review.findByPk(reviewId);

    if(!review) {
        return res.status(404).json(
            {
                message: "Review couldn't be found"
            }
        )
    };

    if (req.user.id !== review.userId) {
        return res.status(403).json(
            {
                 message: 'Forbidden' 
            }
        );
    };

    review.set({
        review: req.body.review,
        stars: req.body.stars
    });

    await review.save();

    return res.json(review);

});

module.exports = router;