const { db } = require("../../lib/db");

// withdraw available funds to coaches
const withdrawFundsToCoaches = async (req, res) => {
  try {
    // get coaches with available funds
    const coaches = await db.coach.findMany({
      where: {
        coachVerified: "VERIFIED",
        availableForWithdrawal: {
          gt: 0,
        },
      },
      select: {
        availableForWithdrawal: true,
        id: true,
      },
    });

    // add new withdrawal record for each coach
    for (let coach of coaches) {
      await db.withdrawals.create({
        data: {
          amount: coach.availableForWithdrawal,
          coachId: coach.id,
          status: "FINISHED",
        },
      });
    }

    // update coach availableForWithdrawal to 0
    await db.coach.updateMany({
      where: {
        coachVerified: "VERIFIED",
        availableForWithdrawal: {
          gt: 0,
        },
      },
      data: {
        availableForWithdrawal: 0,
      },
    });

    res.json({ message: "Funds withdrawn successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { withdrawFundsToCoaches };
