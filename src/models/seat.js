const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seat = sequelize.define('Seat', {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isOccupied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  auditoriumId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Auditoriums',
      key: 'id',
    },
  },
}, {
  tableName: 'Seats',
});

module.exports = Seat;