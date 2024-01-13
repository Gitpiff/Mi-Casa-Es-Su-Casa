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




module.exports = router;