'use strict';
const moment=require('moment')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Showtime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cinema_movie,Seat}) {
      // define association here
      this.belongsTo(Cinema_movie,{foreignKey: 'cmId'})
      this.hasMany(Seat,{foreignKey:'showtimeId'})
    }
  };
  Showtime.init({
    startTime: {
      type: DataTypes.DATE,
      get:function(){
        return moment(this.getDataValue('startTime')).format('MMMM Do YYYY, h:mm:ss a')
      }
    },
    cmId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Showtime',
  });
  return Showtime;
};