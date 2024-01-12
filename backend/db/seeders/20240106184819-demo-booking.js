'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoBookings = [
  {
    userId: 1,
    spotId: 2,
    startDate: "2024-03-10",
    endDate: "2024-03-20"
  },
  {
    userId: 2,
    spotId: 1,
    startDate: "2023-09-15",
    endDate: "2023-09-27"
  },
  {
    userId: 3,
    spotId: 3,
    startDate: "2024-08-27",
    endDate: "2024-08-30"
  },
  {
    userId: 2,
    spotId: 2,
    startDate: "2024-12-23",
    endDate: "2024-12-28"
  },
  {
    userId: 1,
    spotId: 4,
    startDate: "2024-11-05",
    endDate: "2024-11-10"
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(demoBookings, { validate: true })
    //await queryInterface.bulkInsert(demoBookings, options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.or]: demoBookings }, {});
  }
};