const Booking = require('../models/booking');
const Auditorium = require('../models/auditorium');
const Booker = require('../models/booker');
const Seat = require('../models/seat')

exports.getAvailability = async (req, res) => {
  try {
    const auditoriums = await Auditorium.findAll({
      include: [{
        model: Seat,
        as: 'auditoriumSeats',
        attributes: ['number'],
        include: [{
          model: Booking,
          as: 'bookings',
          attributes: ['time']
        }]
      }]
    });

    const result = auditoriums.map(auditorium => {
      const seats = auditorium.auditoriumSeats.map(seat => {
        const isOccupied = seat.bookings.some(booking => booking.time === req.query.time);
        return {
          number: seat.number,
          isOccupied
        };
      });

      return {
        id: auditorium.id,
        name: auditorium.name,
        seats,
        times: auditorium.times,
        createdAt: auditorium.createdAt,
        updatedAt: auditorium.updatedAt
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createBooking = async (req, res) => {
  const { auditoriumId, time, seat, email, bookerId } = req.body;
  try {
    // Verificar si la sala, horario y asiento están disponibles
    const existingBooking = await Booking.findOne({ where: { auditoriumId, time, seat } });
    if (existingBooking) {
      return res.status(400).json({ msg: 'Seat already booked at this time' });
    }

    // Verificar si el asiento existe en la sala
    const seatRecord = await Seat.findOne({ where: { auditoriumId, number: seat } });
    if (!seatRecord) {
      return res.status(400).json({ msg: 'Invalid seat number for the selected auditorium' });
    }

    // Crear la nueva reserva
    const booking = await Booking.create({
      auditoriumId,
      time,
      seat,
      email,
      bookerId
    });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookingConfirmation = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener el booking
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Obtener el nombre del auditorium basado en auditoriumId
    const auditorium = await Auditorium.findByPk(booking.auditoriumId);
    const auditoriumName = auditorium ? auditorium.name : 'N/A';

    res.json({
      email: booking.email,
      reservationCode: booking.id,
      auditorium: auditoriumName,
      time: booking.time,
      seat: booking.seat,
    });
  } catch (err) {
    console.error('Error fetching booking confirmation:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    // Primero, obtén todos los bookings sin incluir los auditoriums
    const bookings = await Booking.findAll();

    // Luego, para cada booking, obtén el auditorium asociado
    const detailedBookings = await Promise.all(bookings.map(async (booking) => {
      const auditorium = await Auditorium.findByPk(booking.auditoriumId);
      return {
        ...booking.toJSON(),
        auditoriumDetails: auditorium ? auditorium.name : 'N/A'
      };
    }));

    res.json(detailedBookings);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { time, seat, email, auditoriumId, bookerId } = req.body;


  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    booking.time = time;
    booking.seat = seat;
    booking.email = email;
    booking.auditoriumId = auditoriumId;
    booking.bookerId = bookerId;

    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error('Error updating booking:', err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    await booking.destroy();

    res.json({ msg: 'Booking deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};