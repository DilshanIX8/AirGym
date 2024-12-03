const { db } = require("../../../lib/db");
const {
  getAnalytics,
  getAnalyticsShoulders,
  getAnalyticsChest,
  getAnalyticsNeck,
  getAnalyticsBiceps,
  getAnalyticsCalf,
  getAnalyticsWaist,
  getAnalyticsThigh,
  getAnalyticsHips,
  getAnalyticsForearm,
  getAnalyticsHeight,
  getAnalyticsWeight,
} = require("../../../utils/analytics");

const validateCoach = async (req, res) => {
  try {
    const { username } = req.params;

    // if username is not provided
    if (!username) {
      return false;
    }

    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    // if user not found
    if (!user) {
      return false;
    }

    // if user not a client
    if (user.role !== "CLIENT") {
      return false;
    }

    // check requested user is coach
    const coach = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        coach: true,
      },
    });

    // check any session is available for both of them
    const session = await db.session.findFirst({
      where: {
        coachId: coach.coach.id,
        userId: user.id,
      },
    });

    if (!session) {
      return false;
    }

    // if coach not found
    if (!coach) {
      return false;
    }

    // if coach not a coach
    if (coach.role !== "COACH") {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

const getClientAnalytics = async (req, res) => {
  try {
    const { username, type } = req.params;
    const isValidUser = await validateCoach(req, res);
    if (!isValidUser) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let analytics = null;
    switch (type) {
      case "shoulders":
        analytics = await getAnalyticsShoulders(username);
        break;
      case "chest":
        analytics = await getAnalyticsChest(username);
        break;
      case "neck":
        analytics = await getAnalyticsNeck(username);
        break;
      case "biceps":
        analytics = await getAnalyticsBiceps(username);
        break;
      case "thigh":
        analytics = await getAnalyticsThigh(username);
        break;
      case "calf":
        analytics = await getAnalyticsCalf(username);
        break;
      case "waist":
        analytics = await getAnalyticsWaist(username);
        break;
      case "hip":
        analytics = await getAnalyticsHips(username);
        break;
      case "forearm":
        analytics = await getAnalyticsForearm(username);
        break;
      case "height":
        analytics = await getAnalyticsHeight(username);
        break;
      case "weight":
        analytics = await getAnalyticsWeight(username);
        break;
      default:
        analytics = await getAnalytics(username);
        break;
    }

    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getClientAnalytics,
};
