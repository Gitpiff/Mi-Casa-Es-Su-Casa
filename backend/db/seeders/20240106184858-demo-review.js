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
    review: "Very Clean!",
    stars: 4
  },
  {
    userId: 2,
    spotId: 2,
    review: "Room too small",
    stars: 3
  },
  {
    userId: 3,
    spotId: 3,
    review: "Location is perfect!!",
    stars: 5
  },
  {
    userId: 2,
    spotId: 4,
    review: "Host was friendly and helpful",
    stars: 4
  },
  {
    userId: 2,
    spotId: 1,
    review: "Beautiful View!",
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
  
  await Review.bulkCreate(options, demoReviews)
  //await queryInterface.bulkInsert(options, demoReviews)
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or]: demoReviews
    }, {});
  }
};
