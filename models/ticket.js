'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Seat}) {
      // define association here
      this.belongsTo(User)
      this.belongsTo(Seat)
    }
  };
  Ticket.init({
    userId: DataTypes.INTEGER,
    seatId: DataTypes.INTEGER,
    status: DataTypes.ENUM('complete','pending')
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};