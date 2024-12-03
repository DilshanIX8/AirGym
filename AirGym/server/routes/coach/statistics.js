const { db } = require("../../lib/db");

// get statistics of a coach
const getCoachStatistics = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // create start date
    const days = 30;
    const now = new Date();
    const startDate = new Date(now - days * 24 * 60 * 60 * 1000);
    // get coach id from coach table
    const coach = await db.coach.findUnique({
      where: {
        userId: id,
      },
    });

    // get total number of sessions in last 30 days
    const totalSessions = await db.session.count({
      where: {
        coachId: coach.id,
        createdAt: {
          gte: startDate,
        },
      },
    });

    // get total income in last 30 days
    const totalIncome = await db.payment.aggregate({
      where: {
        session: {
          coachId: coach.id,
          createdAt: {
            gte: startDate,
          },
        },
        type: "SESSION",
      },
      // sum of remaining amount
      _sum: {
        remaining: true,
      },
    });

    // last 30 days income grouped by dates if any date has no income it will include in the result with 0
    const incomeByDate = await db.payment.groupBy({
      by: ["createdAt"],
      where: {
        session: {
          coachId: coach.id,
          createdAt: {
            gte: startDate,
          },
        },
        type: "SESSION",
      },
      // sum of remaining amount
      _sum: {
        remaining: true,
      },
    });

    // last 30 days sessions grouped by dates if any date has no sessions it will include in the result with 0
    const sessionsByDate = await db.session.groupBy({
      by: ["createdAt"],
      where: {
        coachId: coach.id,
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
    });

    const dateRange = [];
    for (let d = startDate; d <= now; d.setDate(d.getDate() + 1)) {
      dateRange.push(new Date(d));
    }

    // map income by date with missing dates
    const incomeByDateMap = incomeByDate.reduce((acc, item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (acc[date]) {
        acc[date] += item._sum?.remaining;
      } else {
        acc[date] = item._sum?.remaining;
      }
      return acc;
    }, {});

    // map sessions by date with missing dates
    const sessionsByDateMap = sessionsByDate.reduce((acc, item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (acc[date]) {
        acc[date] += item._count;
      } else {
        acc[date] = item._count;
      }
      return acc;
    }, {});

    // map sessions by date with missing dates
    const dataByDate = dateRange.map((date) => {
      const dateString = date.toISOString().split("T")[0];
      return {
        date: dateString,
        sessions: sessionsByDateMap[dateString] || 0,
        income: incomeByDateMap[dateString] || 0,
      };
    });

    // return statistics
    res.status(200).json({
      totalSessions,
      totalIncome,
      dataByDate,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getCoachStatistics };
