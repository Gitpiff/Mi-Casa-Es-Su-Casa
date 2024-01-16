const express = require('express');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    if (!user) {
        return res.status(401).json({
            message: "Authentication required"
        })
    };

    
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

    if (!bookings.length) {
        return res.status(404).json({
            message: "Bookings couldn't be found"
        })
    };
    
    const bookingsArr = [];
    const Bookings = [];

    bookings.forEach(booking => {
        bookingsArr.push(booking.toJSON())
    });

    bookingsArr.forEach(booking => {
        booking.Spot.lat = Number.parseFloat(booking.Spot.lat);
        booking.Spot.lng = Number.parseFloat(booking.Spot.lng);
        booking.Spot.price = Number.parseFloat(booking.Spot.price);

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

    res.json({Bookings})
});


//Edit a Booking
router.put('/:bookingId', requireAuth, async(req, res, next) => {
    const { user } = req;
    const bookingId = req.params.bookingId;
    const { startDate, endDate } = req.body;

    if(!user) {
        return res.status(401).json(
            {
                message: "Authentication required"
            }
        )
    };

    let newStartDate = new Date(startDate).getTime();
    let newEndDate = new Date(endDate).getTime();

    if(newStartDate < Date.now() && newEndDate < Date.now()) {
        return res.status(400).json(
            {
                message: "Bad request",
                errors: {
                    startDate: "startDate cannot be in the past",
                    endDate: "endDate cannot be in the past"
                }
            }
        )
    } else if (newStartDate < Date.now()) {
        return res.status(400).json(
            {
                message: "Bad request",
                errors: {
                    startDate: "startDate cannot be in the past"
                }
            }
        )
    } else if (newEndDate < Date.now()) {
        return res.status(400).json(
            {
                message: "Bad request",
                errors: {
                    startDate: "endDate cannot be in the past"
                }
            }
        )
    };

    if (!startDate || !endDate || (startDate >= endDate)) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }

    const existingBooking = await Booking.findByPk(bookingId, {
        include: {
            model: Spot
        },
        where: {
            userId: user.id
        }
    });

    if (!existingBooking) return res.status(404).json({
        message: "Booking couldn't be found"
    })


    if (existingBooking.userId !== user.id) return res.status(403).json({
        message: "Forbidden"
    })

    if (existingBooking.endDate < Date.now()) return res.status(403).json({
        message: "Past bookings can't be modified"
    })

    let spotId = existingBooking.Spot.id

    const spotBookings = await Booking.findAll({
        where: { spotId: spotId }
    })

    let errors = [];

    spotBookings.forEach(booking => {

        if (booking.id !== existingBooking.id) {
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
        }
    })



    if (!errors.length) {
        existingBooking.update({ startDate, endDate });

        await existingBooking.save();


        let bookingData = {
            id: existingBooking.id,
            spotId: existingBooking.spotId,
            userId: existingBooking.userId,
            startDate: startDate,
            endDate: endDate,
            createdAt: existingBooking.createdAt,
            updatedAt: existingBooking.updatedAt
        }
        return res.status(200).json(bookingData);
    }

});


//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const bookingId = Number(req.params.bookingId);
    const booking = await Booking.findByPk(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });

    const spot = await Spot.findByPk(booking.spotId);

    if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) return res.status(403).json({ message: 'Forbidden' });

    let bookedStartDate = new Date(booking.startDate);
    let today = new Date();

    if (bookedStartDate <= today) return res.status(403).json({ message: "Bookings that have been started can't be deleted" })

    await booking.destroy();

    return res.json({ message: "Successfully deleted" })
});


module.exports = router;
