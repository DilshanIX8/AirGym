const { verificationSchema } = require("../../validations/auth");
const {
  getUserByEmail,
  getVerificationCodeByEmail,
} = require("../../utils/users");
const { db } = require("../../lib/db");

const verifyEmail = async (req, res) => {
  try {
    const data = req.body;
    // validate data
    const validatedData = verificationSchema.safeParse(data);
    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }
    // get data from request body
    const { email, code } = validatedData.data;

    // get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        error: "User with this email does not exist.",
      });
    }

    // check if user already verified email
    if (user.emailVerified) {
      return res.status(400).json({
        error: "Email already verified.",
      });
    }

    // get verification code by email
    const verificationCode = await getVerificationCodeByEmail(email);

    // no code found
    if (!verificationCode) {
      return res.status(400).json({
        error: "No verification code found.",
      });
    }

    // check if code is correct
    if (verificationCode.code !== code) {
      return res.status(400).json({
        error: "Wrong verification code.",
      });
    }

    // update user emailVerified to true
    await db.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    // delete verification code
    await db.verificationCodes.delete({
      where: {
        email,
      },
    });

    return res.status(200).json({
      success: "Email verified.",
    });
  } catch (e) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = verifyEmail;
