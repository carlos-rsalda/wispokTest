const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Auditorium = sequelize.define('Auditorium', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  times: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
}, {
  tableName: 'Auditoriums'
});

module.exports = Auditorium;