const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Booking = require('./booking'); 


const Seat = sequelize.define('Seat', {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  auditoriumId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Auditoriums',
      key: 'id'
    }
  }
});


Seat.hasMany(Booking, { foreignKey: 'seat', as: 'bookings' });
Booking.belongsTo(Seat, { foreignKey: 'seat' });

module.exports = Seat;