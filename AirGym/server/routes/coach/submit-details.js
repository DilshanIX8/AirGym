const {
  getUserByEmail,
  getUserByPhoneNumber,
  getUser,
} = require("../../utils/users");
const {
  coachProfileSchema,
  coachProfessionalDetailsSchema,
  coachPaymentDetailsSchema,
} = require("../../validations/coach");
const { db } = require("../../lib/db");

const submitProfileDetails = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = coachProfileSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // get validated data
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      birthday,
      address,
      idNumber,
    } = validatedData.data;

    // check user submitted email and phone number are equal to the user's email and phone number
    if (email !== req.user.email) {
      // check if another user with this email exists
      const user = await getUserByEmail(email);

      if (user) {
        return res.status(400).json({
          error: "User with this email already exists.",
        });
      }
    }

    if (phoneNumber !== req.user.phoneNumber) {
      console.log(phoneNumber, req.user);
      // check if another user with this phone number exists
      const userPhone = await getUserByPhoneNumber(phoneNumber);

      if (userPhone) {
        return res.status(400).json({
          error: "User with this phone number already exists.",
        });
      }
    }

    if (
      req.user.firstName !== firstName ||
      req.user.lastName !== lastName ||
      req.user.email !== email ||
      req.user.phoneNumber !== phoneNumber
    ) {
      // check any user data updates
      const updatedProfile = await db.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
        },
      });

      if (!updatedProfile) {
        return res.status(400).json({
          error: "Failed to update profile.",
        });
      }
    }

    // check if coach data exists
    const coach = await db.coach.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // if exist data update
    if (coach) {
      await db.coach.update({
        where: {
          id: coach.id,
        },
        data: {
          birthday,
          address,
          idNumber,
        },
      });
    } else {
      // if not exist data create
      await db.coach.create({
        data: {
          birthday,
          address,
          idNumber,
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });
    }

    // get user details again
    const user = await getUser(req.user.id);

    return res.status(200).json({
      message: "Profile details submitted successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const submitCoachImages = async (req, res) => {
  try {
    // check if coach data exists
    const coach = await db.coach.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // create certificates array with file paths
    const certificates = req.files.certificate.map(
      (certificate) => "/uploads/coaches" + certificate.filename
    );

    // if exist data update
    if (coach) {
      await db.coach.update({
        where: {
          id: coach.id,
        },
        data: {
          idFrontImage: "/uploads/coaches" + req.files.IdFrontImage[0].filename,
          idBackImage: "/uploads/coaches" + req.files.IdBackImage[0].filename,
          cameraImage: "/uploads/coaches" + req.files.cameraImage[0].filename,
          certificate: certificates,
        },
      });
    } else {
      return res.status(400).json({
        error: "Please submit your profile details first.",
      });
    }

    return res.status(200).json({
      message: "Images uploaded successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const submitPaymentDetails = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = coachPaymentDetailsSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // get validated data
    const { accountHolderName, nameOfBank, accountNumber, branch } =
      validatedData.data;

    // check if coach data exists
    const coach = await db.coach.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // if user data not exists
    if (!coach) {
      return res.status(400).json({
        error: "Please submit your profile details first.",
      });
    }

    // get payment details
    const payment = await db.paymentAccount.findUnique({
      where: {
        coachId: coach.id,
      },
    });

    // if payment details exists update
    if (payment) {
      await db.paymentAccount.update({
        where: {
          id: payment.id,
        },
        data: {
          accountHolderName,
          nameOfBank,
          accountNumber,
          branch,
        },
      });
    } else {
      // if payment details not exists create
      await db.paymentAccount.create({
        data: {
          accountHolderName,
          nameOfBank,
          accountNumber,
          branch,
          coach: {
            connect: {
              id: coach.id,
            },
          },
        },
      });
    }

    // get user details again
    const user = await getUser(req.user.id);

    return res.status(200).json({
      message: "Payment details submitted successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const submitProfessionalDetails = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = coachProfessionalDetailsSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // get validated data
    const {
      oneSessionFee,
      experience,
      description,
      startTimeSlot,
      endTimeSlot,
    } = validatedData.data;

    // check if coach data exists
    const coach = await db.coach.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // if user data not exists
    if (!coach) {
      return res.status(400).json({
        error: "Please submit your profile details first.",
      });
    }

    await db.coach.update({
      where: {
        id: coach.id,
      },
      data: {
        oneSessionFee,
        experience,
        description,
        startTimeSlot,
        endTimeSlot,
      },
    });

    // get user details again
    const user = await getUser(req.user.id);

    return res.status(200).json({
      message: "Professional details submitted successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const finishCoachProfile = async (req, res) => {
  try {
    // check if coach data exists
    const coach = await db.coach.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // if user data not exists
    if (!coach) {
      return res.status(400).json({
        error: "Please submit your profile details first.",
      });
    }

    await db.coach.update({
      where: {
        id: coach.id,
      },
      data: {
        coachVerified: "PENDING",
      },
    });

    // get user details again
    const user = await getUser(req.user.id);

    // if user not available
    if (!user) {
      return res.status(400).json({
        error: "Please submit your profile details first.",
      });
    }

    return res.status(200).json({
      message: "Coach profile submitted successfully.",
      coach: user?.coach,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  submitProfileDetails,
  submitCoachImages,
  submitPaymentDetails,
  submitProfessionalDetails,
  finishCoachProfile,
};
