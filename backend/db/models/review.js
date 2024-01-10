'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Review.hasMany(models.Spot, {
        foreignKey: 'spotId'
      });

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId'
      });
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [5, 250]
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5
      }
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt:{
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};