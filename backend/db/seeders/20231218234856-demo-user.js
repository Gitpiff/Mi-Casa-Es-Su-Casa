'use strict';
const bcrypt = require('bcryptjs');
const { User } = require('../models');

let options = {};
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

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
   await User.bulkCreate([
    {
      firstName: 'Demo',
      lastName: 'Lition',
      email: 'demo@user.io',
      username: 'Demo-Lition',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      firstName: 'FirstName1',
      lastName: 'LastName1',
      email: 'user1@user.io',
      username: 'FakeUser1',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      firstName: 'FirstName2',
      lastName: 'LastName2',
      email: 'user2@user.io',
      username: 'FakeUser2',
      hashedPassword: bcrypt.hashSync('password3')
    }
   ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['Demo-Lition', 'FakeUser1', 'FakeUser2']
      }
    }, {})
  }
};

fetch('/api/users', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `Oy5nrbs2-aSoOtlvccvJIHQJQTyyHrZgOP3U`
  },
  body: JSON.stringify({
    firstName: 'Demo',
    lastName: 'Lition2',
    email: 'demo1@user.io',
    username: 'Demo-Lition2',
    password: 'password'
  })
}).then(res => res.json()).then(data => console.log(data));