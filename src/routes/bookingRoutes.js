const express = require('express');
const router = express.Router();
const { getSeatsByAuditorium, getAvailability, createBooking, getBookingConfirmation, getAllBookings, updateBooking, deleteBooking } = require('../controllers/bookingController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - auditoriumId
 *         - time
 *         - seat
 *         - email
 *         - bookerId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the booking (not required in request body)
 *         auditoriumId:
 *           type: integer
 *           description: The ID of the auditorium
 *         time:
 *           type: string
 *           description: The time of the booking
 *         seat:
 *           type: integer
 *           description: The seat number
 *         email:
 *           type: string
 *           description: The email of the booker
 *         bookerId:
 *           type: integer
 *           description: The ID of the booker
 *       example:
 *         auditoriumId: 1
 *         time: "3:00 PM"
 *         seat: 15
 *         email: "example@example.com"
 *         bookerId: 1
 *     Booker:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the booker
 *         email:
 *           type: string
 *           description: The email of the booker
 *         password:
 *           type: string
 *           description: The hashed password of the booker
 *       example:
 *         email: example@example.com
 *         password: password123
 *     Auditorium:
 *       type: object
 *       required:
 *         - name
 *         - seats
 *         - times
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the auditorium (not required in request body)
 *         name:
 *           type: string
 *           description: The name of the auditorium
 *         seats:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *                 description: The seat number
 *               isOccupied:
 *                 type: boolean
 *                 description: Indicates if the seat is occupied
 *         times:
 *           type: array
 *           items:
 *             type: string
 *           description: The available times for the auditorium
 *       example:
 *         name: "Sala A"
 *         seats: [
 *           { number: 1, isOccupied: false },
 *           { number: 2, isOccupied: true }
 *         ]
 *         times: ["3:00 PM", "5:00 PM", "7:00 PM"]
 *     Seat:
 *       type: object
 *       required:
 *         - number
 *         - auditoriumId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the seat (not required in request body)
 *         number:
 *           type: integer
 *           description: The seat number
 *         auditoriumId:
 *           type: integer
 *           description: The id of the auditorium the seat belongs to
 *         isOccupied:
 *           type: boolean
 *           description: Indicates if the seat is occupied
 *       example:
 *         number: 15
 *         auditoriumId: 1
 *         isOccupied: false
 */

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: The bookings managing API
 */



/**
 * @swagger
 * /api/bookings/availability:
 *   get:
 *     summary: Gets availability of auditoriums
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of auditoriums
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auditorium'
 *       500:
 *         description: Some server error
 */
router.get('/availability', auth, getAvailability);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Gets all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Some server error
 */
router.get('/', auth, getAllBookings);

/**
 * @swagger
 * /api/bookings/book:
 *   post:
 *     summary: Creates a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: The booking was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: The seat is already booked or invalid seat number
 *       500:
 *         description: Some server error
 */
router.post('/book', auth, createBooking);

/**
 * @swagger
 * /api/bookings/confirmation/{id}:
 *   get:
 *     summary: Gets the booking confirmation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     responses:
 *       200:
 *         description: The booking confirmation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 reservationCode:
 *                   type: string
 *                 auditorium:
 *                   type: string
 *                 time:
 *                   type: string
 *                 seat:
 *                   type: integer
 *       404:
 *         description: The booking was not found
 *       500:
 *         description: Some server error
 */
router.get('/confirmation/:id', auth, getBookingConfirmation);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Updates an existing booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: The booking was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: The booking was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', auth, updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Deletes a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booking id
 *     responses:
 *       200:
 *         description: The booking was successfully deleted
 *       404:
 *         description: The booking was not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id', auth, deleteBooking);

/**
 * @swagger
 * /api/bookings/auditorium/{auditoriumId}/seats:
 *   get:
 *     summary: Gets seats of a specific auditorium
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auditoriumId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the auditorium
 *     responses:
 *       200:
 *         description: The list of seats for the specified auditorium
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seat'
 *       404:
 *         description: No seats found for the specified auditorium
 *       500:
 *         description: Some server error
 */
router.get('/auditorium/:auditoriumId/seats', auth, getSeatsByAuditorium);



module.exports = router;