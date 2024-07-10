const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Booker = require('./booker');
const Booking = require('./booking');
const Auditorium = require('./auditorium');
const Seat = require('./seat');

// Configurar relaciones
Booker.hasMany(Booking, { foreignKey: 'bookerId' });
Booking.belongsTo(Booker, { foreignKey: 'bookerId' });

Auditorium.hasMany(Booking, { foreignKey: 'auditoriumId' });
Booking.belongsTo(Auditorium, { foreignKey: 'auditoriumId' });

Auditorium.hasMany(Seat, { foreignKey: 'auditoriumId', as: 'auditoriumSeats' });
Seat.belongsTo(Auditorium, { foreignKey: 'auditoriumId' });

Seat.hasMany(Booking, { foreignKey: 'seatId' });
Booking.belongsTo(Seat, { foreignKey: 'seatId' });

module.exports = {
  Booker,
  Booking,
  Auditorium,
  Seat,
  sequelize,
};