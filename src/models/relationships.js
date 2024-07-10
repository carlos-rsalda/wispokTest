const { Booker, Booking, Auditorium, Seat } = require('./index');

// Configurar relaciones
Booker.hasMany(Booking);
Booking.belongsTo(Booker);

Auditorium.hasMany(Booking);
Booking.belongsTo(Auditorium);

Auditorium.hasMany(Seat);
Seat.belongsTo(Auditorium);