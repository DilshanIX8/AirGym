const { db } = require("../lib/db");

// get user
const getUser = async (id) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        username: true,
        emailVerified: true,
        profileImage: true,
        _count: {
          select: {
            figureDetails: true,
          },
        },
      },
    });

    if (user.role === "COACH") {
      const coach = await db.coach.findUnique({
        where: {
          userId: id,
        },
        select: {
          ratings: true,
          birthday: true,
          address: true,
          idNumber: true,
          oneSessionFee: true,
          experience: true,
          description: true,
          coachVerified: true,
          startTimeSlot: true,
          endTimeSlot: true,
          paymentAccount: {
            select: {
              accountNumber: true,
              accountHolderName: true,
              nameOfBank: true,
              branch: true,
            },
          },
        },
      });

      return {
        user,
        coach,
      };
    } else {
      return {
        user,
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get user by email function
const getUserByEmail = async (email) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

// get user by username function
const getUserByUsername = async (username, id = undefined) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
        emailVerified: {
          not: null,
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        username: true,
        profileImage: true,
      },
    });

    if (!user) return null;

    const posts = await db.post.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            profileImage: true,
            username: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
                profileImage: true,
              },
            },
          },
        },
        likes: {
          where: {
            userId: id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (user.role === "COACH") {
      const coach = await db.coach.findUnique({
        where: {
          userId: user.id,
        },
        select: {
          birthday: true,
          address: true,
          idNumber: true,
          oneSessionFee: true,
          experience: true,
          startTimeSlot: true,
          endTimeSlot: true,
          description: true,
          ratings: true,
          coachVerified: true,
          sessions: {
            select: {
              review: true,
              rating: true,
            },
          },
        },
      });

      // get tomorrow available time slots
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const reservedSlots = await db.session.findMany({
        where: {
          coach: {
            user: {
              username,
            },
          },
          date: tomorrow,
        },
        select: {
          timeSlot: true,
        },
      });

      // create array from start time slot to end time slot
      let availableSlots = Array.from({
        length: coach.endTimeSlot - coach.startTimeSlot + 1,
      }).map((_, index) => index + coach.startTimeSlot);

      // calculate available slots
      reservedSlots.forEach((slot) => {
        if (availableSlots.includes(slot.timeSlot)) {
          availableSlots = availableSlots.filter((s) => s !== slot.timeSlot);
        }
      });

      return {
        user,
        coach,
        availableSlots,
        posts,
      };
    } else {
      return {
        user,
        posts,
      };
    }
  } catch (error) {
    return null;
  }
};

// get user by phone number function
const getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const user = await db.user.findUnique({
      where: {
        phoneNumber,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

// get verification code  by email function
const getVerificationCodeByEmail = async (email) => {
  try {
    const verificationCode = await db.verificationCodes.findFirst({
      where: {
        email,
      },
    });
    return verificationCode;
  } catch (error) {
    return null;
  }
};

// get password reset code by email function
const getPasswordResetCodeByEmail = async (email) => {
  try {
    const passwordResetCode = await db.passwordResetCode.findFirst({
      where: {
        email,
      },
    });
    return passwordResetCode;
  } catch (error) {
    return null;
  }
};

// get user count by first name and last name function
const getUserCountByFirstNameAndLastName = async (firstName, lastName) => {
  try {
    const userCount = await db.user.count({
      where: {
        firstName,
        lastName,
      },
    });
    return userCount;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getUser,
  getUserByEmail,
  getUserByPhoneNumber,
  getUserByUsername,
  getVerificationCodeByEmail,
  getPasswordResetCodeByEmail,
  getUserCountByFirstNameAndLastName,
};
