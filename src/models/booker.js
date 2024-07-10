const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booker = sequelize.define('Booker', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Bookers'
});

module.exports = Booker;