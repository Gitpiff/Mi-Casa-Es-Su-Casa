const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User } = require('../../db/models');

const router = express.Router();

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
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    const { url } = req.body;

    const review = await Review.findByPk(req.params.reviewId, {
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

module.exports = router;