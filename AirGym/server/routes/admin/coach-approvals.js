const { coachApprovedTemplate } = require("../../emails/coach-approved");
const { coachRejectedTemplate } = require("../../emails/coach-rejected");
const { db } = require("../../lib/db");
const { sendEmail } = require("../../utils/emails");

// approve coach account
const approveCoachAccount = async (req, res) => {
  try {
    const { coachId } = req.params;
    const coach = await db.coach.findUnique({
      where: {
        id: coachId,
      },
      include: {
        user: true,
      },
    });
    if (!coach) {
      return res.status(404).json({ error: "Coach not found" });
    }
    if (coach.coachVerified === "VERIFIED") {
      return res.status(400).json({ error: "Coach is already approved" });
    }
    await db.coach.update({
      where: {
        id: coachId,
      },
      data: {
        coachVerified: "VERIFIED",
      },
    });

    // get coach approve email template
    const emailTemplate = coachApprovedTemplate(
      coach.user.firstName + " " + coach.user.lastName,
      process.env.CLIENT_URL
    );

    // send email to coach
    const isSuccess = await sendEmail(
      coach.user.email,
      "Coach Account Approved",
      emailTemplate,
      undefined
    );

    if (!isSuccess) {
      return res.status(500).json({
        error: "Failed to send email",
      });
    }

    res.json({ message: "Coach account approved" });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// reject coach account approval
const rejectCoachAccount = async (req, res) => {
  try {
    const { reason } = req.body;
    const { coachId } = req.params;

    // if no reason provided
    if (!reason) {
      return res.status(400).json({
        error: "Please provide a reason",
      });
    }

    // check length of reason
    if (reason.length > 500) {
      return res.status(400).json({
        error: "Reason is too long",
      });
    }



    const coach = await db.coach.findUnique({
      where: {
        id: coachId,
      },
      include: {
        user: true,
      },
    });
    if (!coach) {
      return res.status(404).json({ error: "Coach not found" });
    }

    if (coach.coachVerified === "REJECTED") {
      return res.status(400).json({ error: "Coach is already rejected" });
    }
    await db.coach.update({
      where: {
        id: coachId,
      },
      data: {
        coachVerified: "REJECTED",
      },
    });

    // get coach reject email template
    const emailTemplate = coachRejectedTemplate(
      coach.user.firstName + " " + coach.user.lastName,
      process.env.CLIENT_URL,
      reason
    );

    // send email to coach
    const isSuccess = await sendEmail(
      coach.user.email,
      "Coach Account Rejected",
      emailTemplate,
      undefined
    );

    if (!isSuccess) {
      return res.status(500).json({
        error: "Failed to send email",
      });
    }

    res.json({ message: "Coach account rejected" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get pending coach accounts
const getPendingCoachAccounts = async (req, res) => {
  try {
    const coaches = await db.coach.findMany({
      where: {
        coachVerified: "PENDING",
      },
      include: {
        user: {
          select: {
            email: true,
            phoneNumber: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
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
    res.json({ coaches });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  approveCoachAccount,
  getPendingCoachAccounts,
  rejectCoachAccount,
};
