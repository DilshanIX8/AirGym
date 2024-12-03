const {
  sessionCancellationCoachTemplate,
} = require("../../emails/session-cancellation-coach");
const {
  sessionCancellationClientTemplate,
} = require("../../emails/session-cancellation-client");
const { db } = require("../../lib/db");
const axios = require("axios");
const { sendEmail } = require("../../utils/emails");

const cancelSession = async (req, res) => {
  // get session id from request params
  const { id } = req.params;

  // check user data exists
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      session: true,
      coach: true,
    },
  });

  // if user data not exists
  if (!user) {
    return res.status(400).json({
      error: "Please login first.",
    });
  }

  // get today date with zero time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // get session data
  const currentSession = await db.session.findUnique({
    where: {
      id: id,
    },
  });

  // if session not exists
  if (!currentSession) {
    return res.status(400).json({
      error: "Session not found.",
    });
  }

  // if session date is less than today
  if (currentSession.date <= today) {
    return res.status(400).json({
      error: "You can't cancel this session.",
    });
  }

  // check session exists
  let session = await db.session.update({
    where: {
      id: id,
      OR: [
        {
          userId: user.id,
        },
        {
          coachId: user?.coach?.id,
        },
      ],
    },
    data: {
      status: "CANCELLED",
    },

    include: {
      payment: true,
      coach: {
        include: {
          user: true,
        },
      },
      user: true,
    },
  });

  // if user is admin
  if (user.role === "ADMIN") {
    session = await db.session.update({
      where: {
        id: id,
      },
      data: {
        status: "CANCELLED",
      },

      include: {
        payment: true,
        coach: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });
  }

  // if session not found
  if (!session) {
    return res.status(400).json({
      error: "You are not allowed to cancel this session.",
    });
  }

  // if payment not exists
  if (!session.payment) {
    return res.status(400).json({
      error: "Payment not found.",
    });
  }

  /**
   * @TODO : Refund payment
   *  We can't refund payment because we don't have hosted payment page
   * So, we will just change the payment status to refunded
   *
   * @function payhereRefund
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {String} paymentId - Payment id -> we can't get this without hosted payment page
   * @returns {Object | void} - if any error occurs, it will return error response otherwise nothing
   * await payhereRefund(req, res, session?.payment?.paymentId);
   */

  // change payment status to refunded
  const refund = await db.payment.update({
    where: {
      id: session?.payment?.id,
    },
    data: {
      status: "FINISHED",
      type: "CANCELLED_SESSION",
    },
  });

  // if payment status not updated
  if (!refund) {
    return res.status(400).json({
      error: "Payment status not updated.",
    });
  }

  const timeSlotInText = `${session.timeSlot}.00 - ${session.timeSlot + 1}.00`;
  const coach = session.coach.user;
  const client = session.user;

  // get coach email template
  const emailTemplateCoach = sessionCancellationCoachTemplate(
    session.date.toDateString(),
    timeSlotInText,
    client.firstName + " " + client.lastName,
    coach.firstName + " " + coach.lastName
  );

  // get client email template
  const emailTemplateClient = sessionCancellationClientTemplate(
    session.date.toDateString(),
    timeSlotInText,
    coach.firstName + " " + coach.lastName,
    client.firstName + " " + client.lastName
  );

  // send email to coach
  const isSuccess = await sendEmail(
    coach.email,
    "Session Cancelled",
    emailTemplateCoach,
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
    client.email,
    "Session Cancelled",
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
  return res.json({
    message: "Session cancelled successfully.",
  });
};

const payhereRefund = async (req, res, paymentId) => {
  // get payhere token url from env
  const payhereTokenUrl = process.env.PAYHERE_TOKEN_URL;
  // get payhere refund url from env
  const payhereRefundUrl = process.env.PAYHERE_REFUND_URL;
  // get payhere authorization token from env
  const payhereAuthorization = process.env.PAYHERE_AUTHORIZATION_KEY;
  // if payhere token url not exists
  if (!payhereTokenUrl) {
    return res.status(400).json({
      error: "Something went wrong.",
    });
  }
  // if payhere refund url not exists
  if (!payhereRefundUrl) {
    return res.status(400).json({
      error: "Something went wrong.",
    });
  }
  // if payhere authorization token not exists
  if (!payhereAuthorization) {
    return res.status(400).json({
      error: "Something went wrong.",
    });
  }

  // get payhere token
  const payhereToken = await axios.post(
    payhereTokenUrl,
    {
      grant_type: client_credentials,
    },
    {
      headers: {
        Authorization: `Basic ${payhereAuthorization}`,
      },
    }
  );

  // if payhere token not exists
  if (!payhereToken) {
    return res.status(400).json({
      error: "Something went wrong.",
    });
  }

  // refund payment
  const refundPayment = await axios.post(
    payhereRefundUrl,
    {
      payment_id: paymentId,
      description: "Session cancelled.",
    },
    {
      headers: {
        Authorization: `Bearer ${payhereToken?.data?.access_token}`,
      },
    }
  );

  // if payment not refunded
  if (!refundPayment) {
    return res.status(400).json({
      error: "Something went wrong.",
    });
  }

  // destructure data
  const { status } = refundPayment.data;

  // if payment not refunded
  if (status === undefined || status !== 1) {
    return res.status(400).json({
      error: "Payment not refunded.",
    });
  }
};

module.exports = { cancelSession };
