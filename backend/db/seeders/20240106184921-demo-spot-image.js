'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoSpotImages = [
  {
    spotId: 1,
    url: [
      "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2369&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://assets-global.website-files.com/5dcc7f8c449e597be23356e0/657b5c1f9f39325154e5c2ff_Looking%20Towards%202024%20and%20Beyond%20Blog%20Hero%20image.webp"
    ],
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

options.tableName = 'SpotImages';
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
   await queryInterface.bulkInsert(options, demoSpotImages);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.op;
    return queryInterface.bulkDelete(options, {
      [Op.or]: demoSpotImages
    }, {});
  }
};
