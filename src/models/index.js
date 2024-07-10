const Sequelize = require('sequelize');
const { sequelize } = require('../config/database');

const Booker = require('./booker');
const Booking = require('./booking');
const Auditorium = require('./auditorium');
const Seat = require('./seat');

// Configurar relaciones
Booker.hasMany(Booking, { foreignKey: 'bookerId' });
Booking.belongsTo(Booker, { foreignKey: 'bookerId' });

Auditorium.hasMany(Booking, { foreignKey: 'auditoriumId', as: 'bookings' });
Booking.belongsTo(Auditorium, { foreignKey: 'auditoriumId', as: 'auditoriumDetails' });

Auditorium.hasMany(Seat, { foreignKey: 'auditoriumId', as: 'auditoriumSeats' });
Seat.belongsTo(Auditorium, { foreignKey: 'auditoriumId', as: 'auditoriumDetails' });

module.exports = {
  Booker,
  Booking,
  Auditorium,
  Seat,
  sequelize
};