const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Image, User } = require('../../db/models');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    let data = {}
    let currUser = +req.user.id
    let reviews = await Review.findAll({
        where: {
            userId: currUser
        },
        include: [
            {
                model: Spot,
                include: [
                    {
                        model: Image,
                        as: 'SpotImages'
                    }
                ]
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Image,
                as: 'ReviewImages',
                attributes: ['id', 'url']
            }
        ],
    })
    data = reviews.map(review => review.toJSON());

    data.forEach(review => {
        if (review.ReviewImages.length === 0) {
            review.ReviewImages = {
                message: 'no images to display'
            }
        }
        if (review.Spot.SpotImages.length === 0) {
            review.Spot.previewImage = 'no images url'
        } else {
            review.Spot.SpotImages.forEach(image => {
                review.Spot.previewImage = image.url
            })
        }
        delete review.Spot.SpotImages
        delete review.Spot.createdAt
        delete review.Spot.updatedAt
    });
    res.json({ Reviews: data })
});
