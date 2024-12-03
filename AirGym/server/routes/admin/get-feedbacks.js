const { db } = require("../../lib/db");

const getFeedbacks = async (req, res) => {
  try {
    let page = req.query.page || 1;
    const limit = req.query.limit || 25;
    const totalFeedbacks = await db.feedback.count();
    const totalPages = Math.ceil(totalFeedbacks / limit);
    if (page > totalPages) {
      page = totalPages;
    }
    if (page < 1) {
      page = 1;
    }
    const feedbacks = await db.feedback.findMany({
      select: {
        feedback: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    res.json({ feedbacks, totalPages, page });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getFeedbacks,
};
