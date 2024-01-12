'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoSpotImages = [
  {
    spotId: 1,
    url: "https://unsplash.com/photos/person-holding-yellow-plastic-spray-bottle-__ZMnefoI3k",
    preview: true
  },
  {
    spotId: 2,
    url: "https://unsplash.com/photos/rectangular-brown-wooden-table-placed-beside-brown-wooden-armless-chair-inside-dim-light-room-aVW2nU765Nk",
    preview: true
  },
  {
    spotId: 3,
    url: "https://unsplash.com/photos/person-holding-map-D2K1UZr4vxk",
    preview: true
  },
  {
    spotId: 4,
    url: "https://unsplash.com/photos/dog-standing-on-pavement-Crj3gU0aJsU",
    preview: true
  },
  {
    spotId: 5,
    url: "https://unsplash.com/photos/an-aerial-view-of-a-forest-with-yellow-and-green-trees-Jyt4i27VXoc",
    preview: true
  }
]

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
   await SpotImage.bulkCreate(options, demoSpotImages);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.op;
    return queryInterface.bulkDelete(options, {
      [Op.or]: demoSpotImages
    }, {});
  }
};
