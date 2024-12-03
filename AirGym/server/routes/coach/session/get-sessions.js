const { db } = require("../../../lib/db");

const getSessions = async (req, res) => {
  const id = req.user.id;

  // get coach data
  const coach = await db.coach.findUnique({
    where: {
      userId: id,
    },
  });

  try {
    const sessions = await db.session.findMany({
      where: {
        coachId: coach.id,
      },
      select: {
        id: true,
        date: true,
        timeSlot: true,
        status: true,
        review: true,
        rating: true,
        link: true,
        user: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });
    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getSessions };
