const Booker = require('../models/booker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let booker = await Booker.findOne({ where: { email } });
    if (booker) {
      return res.status(400).json({ msg: 'Booker already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    booker = await Booker.create({
      email,
      password: hashedPassword,
    });

    const payload = {
      booker: {
        id: booker.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let booker = await Booker.findOne({ where: { email } });
    if (!booker) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, booker.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      booker: {
        id: booker.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateBooker = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;


  try {
    const booker = await Booker.findByPk(id);

    if (!booker) {
      return res.status(404).json({ msg: 'Booker not found' });
    }

    if (email) {
      booker.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      booker.password = hashedPassword;
    }

    await booker.save();

    res.json(booker);
  } catch (err) {
    console.error('Error updating booker:', err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBooker = async (req, res) => {
  const { id } = req.params;

  try {
    const booker = await Booker.findByPk(id);

    if (!booker) {
      return res.status(404).json({ msg: 'Booker not found' });
    }

    await booker.destroy();

    res.json({ msg: 'Booker deleted' });
  } catch (err) {
    console.error('Error deleting booker:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllBookers = async (req, res) => {
  try {
    const bookers = await Booker.findAll({
      attributes: ['id', 'email'],
    });

    if (!bookers) {
      return res.status(404).json({ msg: 'No bookers found' });
    }

    res.json(bookers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};