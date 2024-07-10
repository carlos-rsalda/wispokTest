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
        attributes: ['number', 'isOccupied'],
        include: [{
          model: Booking,
          attributes: ['time'],
          required: false 
        }]
      }]
    });

    const result = auditoriums.map(auditorium => {
      const seats = auditorium.auditoriumSeats.map(seat => {
        return {
          number: seat.number,
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
    // Verificar si el asiento existe y está ocupado
    const seatRecord = await Seat.findOne({ where: { auditoriumId, number: seat } });
    if (!seatRecord) {
      return res.status(400).json({ msg: 'Invalid seat number for the selected auditorium' });
    }

    if (seatRecord.isOccupied) {
      return res.status(400).json({ msg: 'Seat is already occupied' });
    }

    // Verificar si la sala, horario y asiento están disponibles
    const existingBooking = await Booking.findOne({ where: { auditoriumId, time, seatId: seatRecord.id } });
    if (existingBooking) {
      return res.status(400).json({ msg: 'Seat already booked at this time' });
    }

    // Crear la nueva reserva
    const booking = await Booking.create({
      auditoriumId,
      time,
      seatId: seatRecord.id,
      email,
      bookerId
    });

    // Actualizar el estado del asiento
    seatRecord.isOccupied = true;
    await seatRecord.save();

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
    const bookings = await Booking.findAll();

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

    // Verificar si el asiento está ocupado
    const seatRecord = await Seat.findOne({ where: { auditoriumId, number: seat } });
    if (!seatRecord) {
      return res.status(400).json({ msg: 'Invalid seat number for the selected auditorium' });
    }

    if (seatRecord.isOccupied && seatRecord.id !== booking.seatId) {
      return res.status(400).json({ msg: 'Seat is already occupied' });
    }

    // Actualizar el estado del asiento antiguo si ha cambiado
    if (booking.seatId !== seatRecord.id) {
      const oldSeatRecord = await Seat.findByPk(booking.seatId);
      oldSeatRecord.isOccupied = false;
      await oldSeatRecord.save();

      seatRecord.isOccupied = true;
      await seatRecord.save();
    }

    booking.time = time;
    booking.seatId = seatRecord.id;
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

    // Marcar el asiento como desocupado
    await Seat.update({ isOccupied: false }, { where: { auditoriumId: booking.auditoriumId, number: booking.seat } });

    // Eliminar la reserva
    await booking.destroy();

    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getSeatsByAuditorium = async (req, res) => {
  const { auditoriumId } = req.params;
  try {
    const seats = await Seat.findAll({
      where: { auditoriumId },
      attributes: ['id', 'number', 'isOccupied'],
    });

    if (!seats) {
      return res.status(404).json({ msg: 'No seats found for the specified auditorium' });
    }

    res.json(seats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};