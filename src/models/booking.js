const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seatId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Seats',
      key: 'id',
    },
  },
  auditoriumId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Auditoriums',
      key: 'id',
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bookerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Bookers',
      key: 'id',
    },
  },
}, {
  tableName: 'Bookings',
});

module.exports = Booking;