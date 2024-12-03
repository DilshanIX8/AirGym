const {
  sessionLinkAddedTemplate,
} = require("../../../emails/session-link-added");
const { db } = require("../../../lib/db");
const { sessionAcceptSchema } = require("../../../validations/coach");
const { sendEmail } = require("../../../utils/emails");

const acceptSession = async (req, res) => {
  // get session id from request params
  const { id } = req.params;

  const data = req.body;

  // validate data
  const validatedData = sessionAcceptSchema.safeParse(data);

  // if data not valid
  if (!validatedData.success) {
    return res.status(400).json({
      error: validatedData.error.errors[0].message,
    });
  }

  // destructure data
  const { url } = validatedData.data;

  // check user data exists
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      coach: true,
      session: true,
    },
  });

  // check user is coach
  if (user.role !== "COACH") {
    return res.status(400).json({
      error: "You are not authorized to accept session.",
    });
  }

  // if user data not exists
  if (!user) {
    return res.status(400).json({
      error: "Please login first.",
    });
  }

  // get session data
  const session = await db.session.update({
    where: {
      id: id,
      coachId: user.coach.id,
    },
    data: {
      link: url,
      status: "ACCEPTED",
    },
    include: {
      user: true,
      coach: {
        include: {
          user: true,
        },
      },
    },
  });

  // if session not exists
  if (!session) {
    return res.status(400).json({
      error: "Session not found.",
    });
  }

  const timeSlotInText = `${session.timeSlot}.00 - ${session.timeSlot + 1}.00`;
  const coach = session.coach.user;
  const client = session.user;

  // get email template
  const emailTemplate = sessionLinkAddedTemplate(
    session.user.firstName + " " + session.user.lastName,
    session.date.toDateString(),
    timeSlotInText,
    coach.firstName + " " + coach.lastName,
    url
  );

  // send email
  const isSuccessClient = await sendEmail(
    client.email,
    "Session Link Added",
    emailTemplate,
    undefined
  );

  // if email not sent
  if (!isSuccessClient) {
    return res.status(500).json({
      error: "Failed to send email",
    });
  }

  // return response
  return res.json({
    message: "Session link added successfully.",
  });
};

module.exports = { acceptSession };
