'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoReviews = [
  {
    userId: 1,
    spotId: 1,
    review: "App Academy gave me the skills I needed to take my first step as a Software Engineer. The staff/instructors are awesome, and they hire new grads from App Academy as TAs so that they are always aware of the students' wants and needs.",
    stars: 4
  },
  {
    userId: 2,
    spotId: 1,
    review: "I chose App Academy because it was one of the few bootcamps that still offered an in-person experience. I attended App Academy’s 16-week in person software engineering program in San Francisco. Being able to have your instructors there with you and pair program with your peers in-person was invaluable.",
    stars: 4
  },
  {
    userId: 3,
    spotId: 1,
    review: "I recently completed App Academy's bootcamp and I can say without hesitation that it was one of the best decisions I've ever made. The curriculum was challenging but comprehensive, and the instructors were top-notch. They provided great support and guidance throughout the program, and their industry experience really shone through in their instruction.",
    stars: 5
  },
  {
    userId: 1,
    spotId: 2,
    review: "The X never disappoints. Perfect venue to watch hockey, good places to eat, memorabilia to purchase, it's just a great time, every time. In the past I've also seen concerts here and it's a great place for that as well. Love the X!",
    stars: 3
  },
  {
    userId: 2,
    spotId: 2,
    review: "Had a excellent time at the show tonight. But oh boy was some of the staff rude. We were required to lock up our phones. Which was an inconvenience.",
    stars: 2
  },
  {
    userId: 3,
    spotId: 2,
    review: "We were there for the NCHC tournament. Thank God we are back at the Xcel, so much better than the Target Center. The bathrooms were a bit dirty but I understand it's a busy time. Since bags aren't allowed I didn't have any Tylenol with me.",
    stars: 4
  },
  {
    userId: 1,
    spotId: 3,
    review: "One of the greatest soccer stadiums in the World. I've never heard a stadium crowd as loud as this when Mexico scored against the US in a World Cup Qualifier in 2009.",
    stars: 5
  },
  {
    userId: 2,
    spotId: 3,
    review: "Went for USA vs Mexico. Was a blast and they had good security for us. This is an awesome experience that every USMNT fan should experience.",
    stars: 4
  },
  {
    userId: 3,
    spotId: 3,
    review: "Energy Energy Energy- Fun. Get out early if you can and grab an easy uber. Nothing but beer for alcohol inside so celiac brethren - may want to byob. yes easily doable. worth a visit once.",
    stars: 5
  },
  {
    userId: 1,
    spotId: 4,
    review: "Unsecured. Smelled bad. Bad neighbourhood. People unwilling to help. Lots of lies telled. Pure marketing. Unfinished stadium.",
    stars: 1
  },
  {
    userId: 2,
    spotId: 4,
    review: "I went to a match and everything was better than I thought. The atmosphere was amazing and the fans were crazy even when the team was losing the match.",
    stars: 4
  },
  {
    userId: 3,
    spotId: 4,
    review: "The tour was nice I guess, nothing special but oh boy, as a soccer fan, going to a match at La Bombonera last year was one of the greatest experiences I’ve ever had. ",
    stars: 4
  },
  {
    userId: 1,
    spotId: 5,
    review: "Save your money and wait until the refurbishment is completed. Worst stadium tour I’ve ever been on. No access to changing rooms, tunnel or pitchside. Basically a walk through the trophy room and a view of the pitch from the second tier. Avoid.",
    stars: 1
  },
  {
    userId: 2,
    spotId: 5,
    review: "Amazing multi used stadium, the technology inside leading the world and people thinking of construction. And of course the trophies stored represent the victory history for the Club.",
    stars: 4
  },
  {
    userId: 3,
    spotId: 5,
    review: "A must see if you re a soccer fan. See all cups won including 14 Champions League Cups/European Cup",
    stars: 5
  }
]

options.tableName = 'Reviews';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

  await queryInterface.bulkInsert(options, demoReviews)
  //await queryInterface.bulkInsert(options, demoReviews)
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or]: demoReviews
    }, {});
  }
};
