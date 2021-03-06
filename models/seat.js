'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Showtime,Ticket}) {
      // define association here
      this.belongsTo(Showtime,{foreignKey:'showtimeId',targetKey:'id'})
      this.hasOne(Ticket)
      
    }
  };
  Seat.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    type: DataTypes.STRING,
    showtimeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};