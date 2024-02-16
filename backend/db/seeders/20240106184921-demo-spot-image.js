'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoSpotImages = [
  {
    spotId: 1,
    url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
    preview: true
  },
  {
    spotId: 1,
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: true
  },
  {
    spotId: 1,
    url:  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2369&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: true
  },
  {
    spotId: 1,
    url:  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: true
  },
  {
    spotId: 1,
    url:  "https://assets-global.website-files.com/5dcc7f8c449e597be23356e0/657b5c1f9f39325154e5c2ff_Looking%20Towards%202024%20and%20Beyond%20Blog%20Hero%20image.webp",
    preview: true
  },
  {
    spotId: 2,
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/XcelEnergyCenteroverview.jpg/640px-XcelEnergyCenteroverview.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://i0.wp.com/zonecoverage.com/wp-content/uploads/2020/11/2008-RNC-1-scaled.jpg?fit=800%2C532&ssl=1",
    preview: true
  },
  {
    spotId: 2,
    url: "https://saint-paul-2022.s3.amazonaws.com/imager/files_idss_com/C17/39b802cd-7736-4070-8cef-8d11a2296177/bba07aec-087e-46db-840d-c303ab4412d3_2a23813dca470163f0b2610639f888f1.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://www.rateyourseats.com/shared/Xcel-Energy-Center-Section-230-Row-6-on-9-30-2017f2.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://meyersound.com/wp-content/uploads/2022/11/7_xcel_energy_center.jpg",
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
