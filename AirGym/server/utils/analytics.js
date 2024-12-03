const { db } = require("../lib/db");

const calculatePercentage = (newest, oldest) => {
  return (((newest - oldest) / oldest) * 100).toFixed(2);
};

const calculatedAllAnalytics = (data, key) => {
  data.forEach((d, index) => {
    if (index === data.length - 1) {
      d.current = 0.00;
      d.initial = 0.00;
      return;
    }

    const previousFigure = data[index + 1];
    const oldestFigure = data[data.length - 1];

    d.current = calculatePercentage(d[key], previousFigure[key]);
    d.initial = calculatePercentage(d[key], oldestFigure[key]);
  });

  return data.map(({ [key]: value, ...d }) => ({ value, ...d }));;
};

const getAnalytics = async (username) => {
  try {
    // get all user figure data ordered by create date newest first
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // if there is no figure data return null
    if (!figures.length) {
      return null;
    }

    // if there is only one figure data return 0 for all analytics
    if (figures.length === 1) {
      return {
        shoulders: {
          current: 0,
          initial: 0,
        },
        chest: {
          current: 0,
          initial: 0,
        },
        neck: {
          current: 0,
          initial: 0,
        },
        biceps: {
          current: 0,
          initial: 0,
        },
        thigh: {
          current: 0,
          initial: 0,
        },
        calf: {
          current: 0,
          initial: 0,
        },
        hip: {
          current: 0,
          initial: 0,
        },
        waist: {
          current: 0,
          initial: 0,
        },
        forearm: {
          current: 0,
          initial: 0,
        },
        height: {
          current: 0,
          initial: 0,
        },
        weight: {
          current: 0,
          initial: 0,
        },
        dates: {
          newest: figures[0].createdAt,
          oldest: figures[0].createdAt,
          previous: figures[0].createdAt,
        },
      };
    }

    // get newest figure data
    const newestFigure = figures[0];
    // get oldest figure data
    const oldestFigure = figures[figures.length - 1];
    // get previous figure data
    const previousFigure = figures[1];

    // create a new object to store the analytics
    return {
      shoulders: {
        current: calculatePercentage(
          newestFigure?.shoulders,
          previousFigure?.shoulders
        ),
        initial: calculatePercentage(
          newestFigure?.shoulders,
          oldestFigure?.shoulders
        ),
      },
      chest: {
        current: calculatePercentage(newestFigure?.chest, previousFigure.chest),
        initial: calculatePercentage(newestFigure?.chest, oldestFigure.chest),
      },
      neck: {
        current: calculatePercentage(newestFigure?.neck, previousFigure.neck),
        initial: calculatePercentage(newestFigure?.neck, oldestFigure.neck),
      },
      biceps: {
        current: calculatePercentage(
          newestFigure?.biceps,
          previousFigure.biceps
        ),
        initial: calculatePercentage(newestFigure?.biceps, oldestFigure.biceps),
      },
      thigh: {
        current: calculatePercentage(newestFigure?.thigh, previousFigure.thigh),
        initial: calculatePercentage(newestFigure?.thigh, oldestFigure.thigh),
      },
      calf: {
        current: calculatePercentage(newestFigure?.calf, previousFigure.calf),
        initial: calculatePercentage(newestFigure?.calf, oldestFigure.calf),
      },
      hip: {
        current: calculatePercentage(newestFigure?.hip, previousFigure.hip),
        initial: calculatePercentage(newestFigure?.hip, oldestFigure.hip),
      },
      waist: {
        current: calculatePercentage(newestFigure?.waist, previousFigure.waist),
        initial: calculatePercentage(newestFigure?.waist, oldestFigure.waist),
      },
      forearm: {
        current: calculatePercentage(
          newestFigure?.forearm,
          previousFigure.forearm
        ),
        initial: calculatePercentage(
          newestFigure?.forearm,
          oldestFigure.forearm
        ),
      },
      height: {
        current: calculatePercentage(
          newestFigure?.height,
          previousFigure.height
        ),
        initial: calculatePercentage(newestFigure?.height, oldestFigure.height),
      },
      weight: {
        current: calculatePercentage(
          newestFigure?.weight,
          previousFigure.weight
        ),
        initial: calculatePercentage(newestFigure?.weight, oldestFigure.weight),
      },
      dates: {
        newest: newestFigure.createdAt,
        oldest: oldestFigure.createdAt,
        previous: previousFigure.createdAt,
      },
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getAnalyticsShoulders = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        createdAt: true,
        shoulders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "shoulders");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(
        newestFigure?.shoulders,
        previousFigure?.shoulders
      ),
      initial: calculatePercentage(
        newestFigure?.shoulders,
        oldestFigure?.shoulders
      ),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsChest = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        chest: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "chest");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.chest, previousFigure.chest),
      initial: calculatePercentage(newestFigure?.chest, oldestFigure.chest),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsNeck = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        neck: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "neck");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.neck, previousFigure.neck),
      initial: calculatePercentage(newestFigure?.neck, oldestFigure.neck),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsBiceps = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        biceps: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "biceps");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.biceps, previousFigure.biceps),
      initial: calculatePercentage(newestFigure?.biceps, oldestFigure.biceps),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsThigh = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        thigh: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "thigh");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.thigh, previousFigure.thigh),
      initial: calculatePercentage(newestFigure?.thigh, oldestFigure.thigh),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsCalf = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        calf: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "calf");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.calf, previousFigure.calf),
      initial: calculatePercentage(newestFigure?.calf, oldestFigure.calf),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsWaist = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        waist: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "waist");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.waist, previousFigure.waist),
      initial: calculatePercentage(newestFigure?.waist, oldestFigure.waist),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsHips = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        hip: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "hip");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.hip, previousFigure.hip),
      initial: calculatePercentage(newestFigure?.hip, oldestFigure.hip),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsForearm = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        forearm: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "forearm");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(
        newestFigure?.forearm,
        previousFigure.forearm
      ),
      initial: calculatePercentage(newestFigure?.forearm, oldestFigure.forearm),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsHeight = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        height: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "height");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.height, previousFigure.height),
      initial: calculatePercentage(newestFigure?.height, oldestFigure.height),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

const getAnalyticsWeight = async (username) => {
  try {
    const figures = await db.figureDetails.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        weight: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!figures.length) {
      return null;
    }

    // add initial and current percentage to each records
    const calculatedAnalytics = calculatedAllAnalytics(figures, "weight");

    if (figures.length === 1) {
      return {
        current: 0,
        initial: 0,
        records: calculatedAnalytics,
      };
    }

    const newestFigure = figures[0];
    const oldestFigure = figures[figures.length - 1];
    const previousFigure = figures[1];

    return {
      current: calculatePercentage(newestFigure?.weight, previousFigure.weight),
      initial: calculatePercentage(newestFigure?.weight, oldestFigure.weight),
      records: calculatedAnalytics,
    };
  } catch (e) {
    return null;
  }
};

module.exports = {
  getAnalytics,
  getAnalyticsShoulders,
  getAnalyticsChest,
  getAnalyticsNeck,
  getAnalyticsBiceps,
  getAnalyticsThigh,
  getAnalyticsCalf,
  getAnalyticsWaist,
  getAnalyticsHips,
  getAnalyticsForearm,
  getAnalyticsHeight,
  getAnalyticsWeight,
};
