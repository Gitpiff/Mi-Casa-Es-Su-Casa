'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

//spots
const spots = [
  {
    ownerId: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
    createdAt: "2021-11-19 20:39:36",
    updatedAt: "2021-11-19 20:39:36"
  },
  {
    ownerId: 2,
    address: "007 Ice Lane",
    city: "Minneapolis",
    state: "Minnesota",
    country: "United States of America",
    lat: 73.1545348,
    lng: -102.4830127,
    name: "XCel Energy",
    description: "Minnesota Wild",
    price: 233,
    createdAt: "2021-11-19 20:39:36",
    updatedAt: "2021-11-19 20:39:36"
  },
  {
    ownerId: 3,
    address: "3465 Mexico Ave",
    city: "Mexico",
    state: "CDMX",
    country: "Mexico",
    lat: 57.3445398,
    lng: -119.3939327,
    name: "Estadio Azteca",
    description: "Place to play Futbol",
    price: 793,
    createdAt: "2021-11-19 20:39:36",
    updatedAt: "2021-11-19 20:39:36"
  },
  {
    ownerId: 4,
    address: "123 Argentina Road",
    city: "Buenos Aires",
    state: "Rio de la Plata",
    country: "Argentina",
    lat: 97.8647378,
    lng: -171.2750527,
    name: "Bombonera",
    description: "Maradona's casa",
    price: 113,
    createdAt: "2021-11-19 20:39:36",
    updatedAt: "2021-11-19 20:39:36"
  },
  {
    ownerId: 5,
    address: "123 Madrid Ave",
    city: "Madrid",
    state: "Madrid",
    country: "Espana",
    lat: 97.1644358,
    lng: -100.1740327,
    name: "Santiago Bernabeu",
    description: "Best stadium in Europa",
    price: 123,
    createdAt: "2021-11-19 20:39:36",
    updatedAt: "2021-11-19 20:39:36"
  }
 ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(demoSpots, { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,
      { [Op.or]: demoSpots }, {});
  }
};
