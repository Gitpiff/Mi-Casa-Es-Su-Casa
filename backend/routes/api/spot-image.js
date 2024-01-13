const express = require('express');
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = Number(req.params.imageId);
    const spotImage = await SpotImage.findByPk(imageId, {
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    });

    if (!spotImage) return res.status(404).json({ message: "Spot Image couldn't be found" });

    if (req.user.id !== spotImage.Spot.ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    };

    await spotImage.destroy();

    return res.json({ message: "Successfully deleted" });

});

module.exports = router;