const { db } = require("../../lib/db");
const { filterCoachesSchema } = require("../../validations/public");

const filterCoaches = async (req, res) => {
  try {
    // get data from request query
    const data = req.query;
    // validate data
    const validatedData = filterCoachesSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // get validated data
    const { experience, ratings, price } = validatedData.data;

    // setup filters
    const filters = { coachVerified: "VERIFIED" };
    if (experience) {
      filters.experience = experience;
    }
    if (ratings) {
      switch (ratings) {
        case "ONE_STAR":
          filters.ratings = {
            gte: 1,
          };
          break;
        case "TWO_STAR":
          filters.ratings = {
            gte: 2,
          };
          break;
        case "THREE_STAR":
          filters.ratings = {
            gte: 3,
          };
          break;
        case "FOUR_STAR":
          filters.ratings = {
            gte: 4,
          };
          break;
        case "FIVE_STAR":
          filters.ratings = {
            gte: 5,
          };
          break;
      }
    }

    // get coaches
    const coaches = await db.coach.findMany({
      where: filters,
      select: {
        experience: true,
        oneSessionFee: true,
        description: true,
        ratings: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
            username: true,
          },
        },
      },
      orderBy: {
        oneSessionFee: price === "LOW_TO_HIGH" ? "asc" : "desc",
      },
    });

    return res.status(200).json({
      coaches,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  filterCoaches,
};
