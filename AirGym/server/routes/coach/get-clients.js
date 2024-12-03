const { db } = require("../../lib/db");

const getClients = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // get coach id from coach table
    const coach = await db.coach.findUnique({
      where: {
        userId: id,
      },
    });

    // find unique clients of the coach using user and session tables
    const clients = await db.user.groupBy({
      by: ["username", "email", "firstName", "lastName", "phoneNumber"],
      where: {
        session: {
          some: {
            coachId: coach.id,
          },
        },
      },
    });
    // return clients
    res.status(200).json({ clients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getClients };
