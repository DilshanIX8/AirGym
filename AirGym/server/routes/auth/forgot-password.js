const { emailSchema } = require("../../validations/auth");
const { generatePasswordRestCode } = require("../../utils/codes");
const { forgotPasswordTemplate } = require("../../emails/forgot-password");
const { sendEmail } = require("../../utils/emails");
const { getUserByEmail } = require("../../utils/users");

const forgotPassword = async (req, res) => {
  try {
    const data = req.body;
    // validate data
    const validatedData = emailSchema.safeParse(data);
    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }
    // get email from request body
    const { email } = validatedData.data;

    // get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        error: "User with this email does not exist.",
      });
    }

    // get verification code
    const verificationCode = await generatePasswordRestCode(email);

    // get verification email template
    const emailTemplate = forgotPasswordTemplate(
      verificationCode,
      user.firstName + " " + user.lastName
    );

    // send email to user
    const isSuccess = sendEmail(
      email,
      "Password reset",
      emailTemplate,
      undefined
    );

    if (!isSuccess) {
      return res.status(500).json({
        error: "Failed to send verification email.",
      });
    }

    return res.status(200).json({
      success: "Verification email sent.",
    });
  } catch (e) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = forgotPassword;
