const { db } = require("../../../lib/db");
const { finishSessionSchema } = require("../../../validations/client");

const finishSession = async (req, res) => {
  try {
    // Get the session id from the request parameters
    const { id } = req.params;
    // get the details of the user from the request
    const data = req.body;
    // validate the data
    const validatedData = finishSessionSchema.safeParse(data);
    // check data validation
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }
    // destructuring the data
    const { review, rating } = validatedData.data;
    // check if the session id is not provided
    if (!id) {
      return res.status(400).json({ message: "Session id is required!" });
    }
    // check session id is logged in user's session
    const session = await db.session.findUnique({
      where: {
        id,
        userId: req?.user?.id,
      },
      include: {
        payment: true,
      },
    });

    if (!session) {
      return res.status(400).json({ message: "Session not found!" });
    }
    // update the session with the review and rating
    const updatedSession = await db.session.update({
      where: {
        id,
      },
      data: {
        review: review || null,
        rating: rating || null,
        status: "FINISHED",
      },
    });

    if (!updatedSession) {
      return res.status(400).json({ message: "Session not found!" });
    }

    // get sum of all ratings and count of ratings for the coach
    const ratingForCoach = await db.session.aggregate({
      where: {
        coachId: session.coachId,
        status: "FINISHED",
      },
      _sum: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
    // calculate the average rating
    const averageRating =
      ratingForCoach._sum.rating / ratingForCoach._count.rating;

    // update the coach with the average rating
    const updatedCoach = await db.coach.update({
      where: {
        id: session.coachId,
      },
      data: {
        ratings: averageRating,
        availableForWithdrawal: {
          increment: session.payment.remaining || 0,
        },
      },
    });

    //if the coach is not updated
    if (!updatedCoach) {
      return res.status(400).json({ message: "Something went wrong!" });
    }

    return res.status(200).json({ message: "Session finished successfully!" });
  } catch (error) {
    console.error("Finish Session", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  finishSession,
};
