'use strict';
const {
  Model
} = require('sequelize');
const moment=require('moment')
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cinema_movie}) {
      // define association here
  
      this.hasMany(Cinema_movie)
    }
  };
  Movie.init({
    name: DataTypes.STRING,
    startDate: {
      type:DataTypes.DATEONLY,
      get:function(){
        return moment(this.getDataValue('startTime')).format('L')
      }
    },
    time: DataTypes.INTEGER,
    evaluate: DataTypes.INTEGER,
    poster: DataTypes.STRING,
    trailer: DataTypes.STRING,
    description:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};