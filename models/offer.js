'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Offer.init({
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    name: DataTypes.STRING,
    public:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return Offer;
};