const { db } = require("../../lib/db");

const getSessions = async (req, res) => {
  try {
    const sessions = await db.session.findMany({
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
        coach: {
          select: {
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
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getSessions };
