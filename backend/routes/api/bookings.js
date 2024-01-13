const express = require('express');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    
    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
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
            }
        ]
    });
    
    const bookingsArr = [];
    const Bookings = [];

    bookings.forEach(booking => {
        bookingsArr.push(booking.toJSON())
    });

    bookingsArr.forEach(booking => {
        booking.Spot.lat = Number(booking.Spot.lat);
        booking.Spot.lng = Number(booking.Spot.lng);
        booking.Spot.price = Number(booking.Spot.price);

        booking.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                booking.Spot.previewImage = image.url;
            }
        });
        delete booking.Spot.SpotImages;

        const userBookings = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: booking.Spot,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };
    Bookings.push(userBookings)
    });

    res.json(Bookings)
});





module.exports = router;
