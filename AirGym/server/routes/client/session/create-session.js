const {
  sessionSchema,
  sessionPaymentSchema,
  sessionUpdateSchema,
} = require("../../../validations/client");
const { db } = require("../../../lib/db");
const md5 = require("md5");
const {
  sessionConfirmationCoachTemplate,
} = require("../../../emails/session-confirmation-coach");
const {
  sessionConfirmationClientTemplate,
} = require("../../../emails/session-confirmation-client");
const {
  sessionUpdateCoachTemplate,
} = require("../../../emails/session-update-coach");
const {
  sessionUpdateClientTemplate,
} = require("../../../emails/session-update-client");
const { sendEmail } = require("../../../utils/emails");

// create session
const createPendingSession = async (req, res) => {
  // get data from request body
  const data = req.body;
  // validate data
  const validatedData = sessionSchema.safeParse(data);

  // check data validation
  if (!validatedData.success) {
    return res.status(400).json({
      errors: validatedData.error.errors,
    });
  }

  // destructure validated data
  const { timeSlot, username } = validatedData.data;

  // check if user data exists
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  // if user data not exists
  if (!user) {
    return res.status(400).json({
      error: "Please login first.",
    });
  }

  // check user exists with the username
  const userFromUsername = await db.user.findUnique({
    where: {
      username: username,
      role: "COACH",
    },
    include: {
      coach: true,
    },
  });

  // if user not found
  if (!userFromUsername) {
    return res.status(400).json({
      error: "Coach not found.",
    });
  }

  const coach = userFromUsername.coach;

  // get tomorrow date with zero time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // check time slot is available
  const timeSlotReserved = await db.session.findFirst({
    where: {
      timeSlot,
      date: tomorrow,
      coachId: coach.id,
      status: {
        in: ["PENDING", "RESERVED"],
      },
    },
  });

  // if time slot exists
  if (timeSlotReserved) {
    return res.status(400).json({
      error: "Time slot is already reserved.",
    });
  }

  // create pending session
  const session = await db.session.create({
    data: {
      timeSlot,
      userId: user.id,
      status: "PENDING",
      date: tomorrow,
      coachId: coach.id,
    },
  });

  // if session not created
  if (!session) {
    return res.status(400).json({
      error: "Session not created.",
    });
  }

  // delete pending session after 15 minutes
  setTimeout(() => {
    deletePendingSession(session.id);
  }, 15 * 60 * 1000);

  // generate payment hashes
  const hash = md5(
    process.env.PAYHERE_MERCHANT_ID +
      session.id +
      coach.oneSessionFee.toFixed(2) +
      "LKR" +
      md5(process.env.PAYHERE_SECRET).toUpperCase()
  ).toUpperCase();

  // return success response
  return res.status(200).json({
    success: true,
    payment: {
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: process.env.PAYHERE_RETURN_URL,
      cancel_url: process.env.PAYHERE_CANCEL_URL,
      notify_url: process.env.PAYHERE_NOTIFY_URL,
      order_id: session.id,
      items: `Session Reservation - ${tomorrow.toDateString()}`,
      currency: "LKR",
      amount: coach.oneSessionFee.toFixed(2),
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phoneNumber,
      address: "",
      city: "",
      country: "",
      hash: hash,
    },
  });
};

// complete session reservation
const completeSessionReservation = async (req, res) => {
  // get data from request body
  const data = req.body;
  // validate data
  const validatedData = sessionPaymentSchema.safeParse(data);

  // check data validation
  if (!validatedData.success) {
    return res.status(400).json({
      errors: validatedData.error.errors,
    });
  }

  // destructure data
  const { sessionId, payment, paymentId } = validatedData.data;

  // get session data
  const session = await db.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      coach: {
        include: {
          user: true,
        },
      },
      user: true,
    },
  });

  // if session not found
  if (!session) {
    return res.status(400).json({
      error: "Session not found.",
    });
  }

  // update session status
  const updatedSession = await db.session.update({
    where: {
      id: session.id,
    },
    data: {
      status: "RESERVED",
    },
  });

  // if session not updated
  if (!updatedSession) {
    return res.status(400).json({
      error: "Session not updated.",
    });
  }

  // calculate fee
  const fee = parseFloat((payment * 0.1).toFixed(2));
  const remaining = payment - fee;

  // add payment details
  const paymentRecord = await db.payment.create({
    data: {
      sessionId: session.id,
      amount: payment,
      fee,
      remaining,
      paymentId
    },
  });

  // if payment not created
  if (!paymentRecord) {
    return res.status(400).json({
      error: "Payment not created.",
    });
  }

  const timeSlotInText = `${session.timeSlot}.00 - ${session.timeSlot + 1}.00`;
  const coach = session.coach.user;
  const user = session.user;

  // get coach email template
  const emailTemplate = sessionConfirmationCoachTemplate(
    coach.firstName + " " + coach.lastName,
    session.date.toDateString(),
    timeSlotInText,
    user.firstName + " " + user.lastName,
    payment.toFixed(2)
  );

  // get client email template
  const emailTemplateClient = sessionConfirmationClientTemplate(
    user.firstName + " " + user.lastName,
    session.date.toDateString(),
    timeSlotInText,
    coach.firstName + " " + coach.lastName,
    payment.toFixed(2)
  );

  // send email to coach
  const isSuccess = await sendEmail(
    coach.email,
    "Session Reserved",
    emailTemplate,
    undefined
  );

  // if email not sent
  if (!isSuccess) {
    return res.status(500).json({
      error: "Failed to send email",
    });
  }

  // send email to client
  const isSuccessClient = await sendEmail(
    user.email,
    "Session Reserved",
    emailTemplateClient,
    undefined
  );

  // if email not sent
  if (!isSuccessClient) {
    return res.status(500).json({
      error: "Failed to send email",
    });
  }

  // return success response
  return res.status(200).json({
    success: true,
  });
};

// update time slot
const updateTimeSlot = async (req, res) => {
  // get session id from request params
  const { id } = req.params;

  // get data from request body
  const data = req.body;
  // validate data
  const validatedData = sessionUpdateSchema.safeParse(data);

  // check data validation
  if (!validatedData.success) {
    return res.status(400).json({
      errors: validatedData.error.errors,
    });
  }

  // destructure validated data
  const { timeSlot } = validatedData.data;

  // check if user data exists
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  // if user data not exists
  if (!user) {
    return res.status(400).json({
      error: "Please login first.",
    });
  }

  // get session data
  const session = await db.session.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
    include: {
      coach: {
        include: {
          user: true,
        },
      },
    },
  });

  // if session not found
  if (!session) {
    return res.status(400).json({
      error: "Session not found.",
    });
  }

  // get tomorrow date with zero time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // check new time slot is available
  const timeSlotReserved = await db.session.findFirst({
    where: {
      timeSlot,
      date: tomorrow,
      coachId: session.coachId,
      status: {
        in: ["PENDING", "RESERVED"],
      },
    },
  });

  // if time slot exists
  if (timeSlotReserved) {
    return res.status(400).json({
      error: "Time slot is already reserved.",
    });
  }

  // update session time slot
  const updatedSession = await db.session.update({
    where: {
      id: session.id,
    },
    data: {
      date: tomorrow,
      timeSlot,
    },
  });

  // if session not updated
  if (!updatedSession) {
    return res.status(400).json({
      error: "Session not updated.",
    });
  }

  const timeSlotInText = `${session.timeSlot}.00 - ${session.timeSlot + 1}.00`;
  const coach = session.coach.user;

  // get coach email template
  const emailTemplate = sessionUpdateCoachTemplate(
    coach.firstName + " " + coach.lastName,
    session.date.toDateString(),
    timeSlotInText,
    user.firstName + " " + user.lastName
  );

  // get client email template
  const emailTemplateClient = sessionUpdateClientTemplate(
    user.firstName + " " + user.lastName,
    session.date.toDateString(),
    timeSlotInText,
    coach.firstName + " " + coach.lastName
  );

  // send email to coach
  const isSuccess = await sendEmail(
    coach.email,
    "Session Updated",
    emailTemplate,
    undefined
  );

  // if email not sent
  if (!isSuccess) {
    return res.status(500).json({
      error: "Failed to send email",
    });
  }

  // send email to client
  const isSuccessClient = await sendEmail(
    user.email,
    "Session Updated",
    emailTemplateClient,
    undefined
  );

  // if email not sent
  if (!isSuccessClient) {
    return res.status(500).json({
      error: "Failed to send email",
    });
  }

  // return success response
  return res.status(200).json({
    success: true,
  });
};

// delete pending session
const deletePendingSession = async (id) => {
  // get session data
  const session = await db.session.findUnique({
    where: {
      id,
    },
  });

  // if session not found
  if (!session) {
    return false;
  }

  // delete session
  if (session.status === "PENDING") {
    const deletedSession = await db.session.delete({
      where: {
        id,
      },
    });

    // if session not deleted
    if (!deletedSession) {
      return false;
    }
  }

  return true;
};

module.exports = {
  createPendingSession,
  completeSessionReservation,
  updateTimeSlot,
};
