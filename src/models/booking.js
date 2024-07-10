const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  auditoriumId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Auditoriums',
      key: 'id'
    }
  },
  bookerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Bookers',
      key: 'id'
    }
  }
}, {
  tableName: 'Bookings'
});

module.exports = Booking;