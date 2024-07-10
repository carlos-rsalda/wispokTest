const express = require('express');
const router = express.Router();
const { getAllBookers, register, login, updateBooker, deleteBooker } = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booker:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the booker (not required in request body)
 *         email:
 *           type: string
 *           description: The email of the booker
 *         password:
 *           type: string
 *           description: The password of the booker
 *       example:
 *         email: example@example.com
 *         password: password123
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registers a new booker
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booker'
 *     responses:
 *       200:
 *         description: The booker was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booker'
 *       400:
 *         description: The booker already exists
 *       500:
 *         description: Some server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logs in a booker
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: example@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: The booker was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     summary: Updates an existing booker
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booker id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booker'
 *     responses:
 *       200:
 *         description: The booker was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booker'
 *       404:
 *         description: The booker was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', updateBooker);

/**
 * @swagger
 * /api/auth/{id}:
 *   delete:
 *     summary: Deletes a booker
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The booker id
 *     responses:
 *       200:
 *         description: The booker was successfully deleted
 *       404:
 *         description: The booker was not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id', deleteBooker);


/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Gets all bookers
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of bookers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booker'
 *       500:
 *         description: Some server error
 */
router.get('/', getAllBookers);

module.exports = router;