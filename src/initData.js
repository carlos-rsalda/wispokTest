const { sequelize } = require('./config/database');
const { Auditorium, Seat } = require('./models');

const initData = async () => {
  try {
    await sequelize.sync(); 
    console.log('Database synchronized');

    const count = await Auditorium.count();
    if (count === 0) {
      const auditoriums = [
        { name: 'Sala A', seats: 20, times: ['3:00 PM', '5:00 PM', '7:00 PM'] },
        { name: 'Sala B', seats: 20, times: ['3:00 PM', '5:00 PM', '7:00 PM'] },
        { name: 'Sala C', seats: 30, times: ['3:00 PM', '5:00 PM', '7:00 PM'] },
      ];

      for (const aud of auditoriums) {
        const auditorium = await Auditorium.create({
          name: aud.name,
          times: aud.times
        });

        for (let i = 1; i <= aud.seats; i++) {
          await Seat.create({
            number: i,
            auditoriumId: auditorium.id,
            isOccupied: false,
          });
        }
      }

      console.log('Auditoriums and seats initialized');
    } else {
      console.log('Auditoriums already initialized');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

module.exports = initData;