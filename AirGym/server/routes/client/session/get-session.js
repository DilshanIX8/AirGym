const { db } = require("../../../lib/db");

const getSession = async (req, res) => {
  const id = req.user.id;

  try {
    const sessions = await db.session.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        date: true,
        timeSlot: true,
        status: true,
        review: true,
        rating: true,
        link: true,
        coach: {
          select: {
            oneSessionFee: true,
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
        },
      },
    });
    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getSession };
