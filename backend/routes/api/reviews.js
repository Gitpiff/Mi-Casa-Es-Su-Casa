const express = require('express');
const { check } = require('express-validator');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User, SpotImage } = require('../../db/models');
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

    if (!user) {
        return res.status(401).json({
            message: "Authentication required"
        })
    };

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
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: SpotImage
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    if (!reviews.length) {
        return res.status(404).json({
            message: "No reviews could be found"
        })
    };

    const reviewObj = {};
    const reviewsList = [];

    reviews.forEach(review => {
        reviewsList.push(review.toJSON())
    });

    reviewsList.forEach(review => {
        review.Spot.lat = Number(review.Spot.lat);
        review.Spot.lng = Number(review.Spot.lng);
        review.Spot.price = Number(review.Spot.price);

        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                review.Spot.previewImage = image.url;
            }
        });
        delete review.Spot.SpotImages;
    });

    reviewObj.Reviews = reviewsList;

    return res.json(reviewObj);
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

//Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
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

    await review.destroy();

    return res.json(
        {
            message: "Successfully deleted"
        }
    )
});

module.exports = router;