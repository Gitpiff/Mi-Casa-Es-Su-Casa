'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(3,7),
      allowNull: false,
      validate: {
        min: - 90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(3,7),
      allowNull: false,
      validate: {
        min: - 180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      // validate: {
      //   min: 1
      // }
    },
    createdAt:  {
      type: DataTypes.DATE
    },
    updatedAt:  {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Spot',
    // defaultScope: {
    //   attributes: {
    //     exclude: ['createdAt', 'updatedAt']
    //   }
    // }
  });
  return Spot;
};