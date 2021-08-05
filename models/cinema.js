'use strict';
const {
  Model
} = require('sequelize');
const showtime = require('./showtime');
module.exports = (sequelize, DataTypes) => {
  class Cinema extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cineplex,Cinema_movie}) {
      // define association here
      this.belongsTo(Cineplex)
      this.hasMany(Cinema_movie)
     
    }
  };
  Cinema.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    cineplexId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cinema',
  });
  return Cinema;
};