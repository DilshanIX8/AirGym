const { db } = require("../../lib/db");

// get statistics of a system
const getSystemStatistics = async (req, res) => {
  try {
    // create start date
    const days = 30;
    const now = new Date();
    const startDate = new Date(now - days * 24 * 60 * 60 * 1000);

    // get total number of sessions in last 30 days
    const totalSessions = await db.session.count({
      where: {
        createdAt: {
          gte: startDate,
        },
        payment: {
          type: "SESSION",
        },
      },
    });

    // get total income in last 30 days
    const totalIncome = await db.payment.aggregate({
      where: {
        session: {
          createdAt: {
            gte: startDate,
          },
        },
        type: "SESSION",
      },
      // sum of fees
      _sum: {
        fee: true,
      },
    });

    // get new users in last 30 days
    const newUsers = await db.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // last 30 days income grouped by dates if any date has no income it will include in the result with 0
    const incomeByDate = await db.payment.groupBy({
      by: ["createdAt"],
      where: {
        session: {
          createdAt: {
            gte: startDate,
          },
        },
        type: "SESSION",
      },
      // sum of fees
      _sum: {
        fee: true,
      },
    });

    // last 30 days sessions grouped by dates if any date has no session it will include in the result with 0
    const sessionsByDate = await db.session.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
        },
        payment: {
          type: "SESSION",
        },
      },
      _count: {
        id: true,
      },
    });

    // last 30 days user registrations grouped by dates if any date has no user it will include in the result with 0
    const usersByDate = await db.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
    });

    const dateRange = [];
    for (let d = startDate; d <= now; d.setDate(d.getDate() + 1)) {
      dateRange.push(new Date(d));
    }

    // map income by date with missing dates
    const incomeByDateMap = incomeByDate.reduce((acc, item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (acc[date]) {
        acc[date] += item._sum?.fee;
      } else {
        acc[date] = item._sum?.fee;
      }
      return acc;
    }, {});

    // map sessions by date with missing dates
    const sessionsByDateMap = sessionsByDate.reduce((acc, item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (acc[date]) {
        acc[date] += item._count.id;
      } else {
        acc[date] = item._count.id;
      }
      return acc;
    }, {});

    // map users by date with missing dates
    const usersByDateMap = usersByDate.reduce((acc, item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (acc[date]) {
        acc[date] += item._count.id;
      } else {
        acc[date] = item._count.id;
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
        users: usersByDateMap[dateString] || 0,
      };
    });

    res.json({
      totalSessions,
      totalIncome,
      newUsers,
      dataByDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get statistics" });
  }
};

module.exports = { getSystemStatistics };
