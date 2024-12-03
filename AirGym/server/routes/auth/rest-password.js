const bcrypt = require("bcryptjs");
const { resetPasswordSchema } = require("../../validations/auth");
const {
  getUserByEmail,
  getPasswordResetCodeByEmail,
} = require("../../utils/users");
const { db } = require("../../lib/db");

const resetPassword = async (req, res) => {
  try {
    const data = req.body;
    // validate data
    const validatedData = resetPasswordSchema.safeParse(data);
    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }
    // get data from request body
    const { email, code, password } = validatedData.data;

    // get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        error: "User with this email does not exist.",
      });
    }

    // get passwordReset code by email
    const passwordResetCode = await getPasswordResetCodeByEmail(email);

    // no code found
    if (!passwordResetCode) {
      return res.status(400).json({
        error: "No password reset code found.",
      });
    }

    // check if code is correct
    if (passwordResetCode.code !== code) {
      return res.status(400).json({
        error: "Wrong verification code.",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update user password
    await db.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // delete password reset code
    await db.passwordResetCode.delete({
      where: {
        email,
      },
    });

    return res.status(200).json({
      success: "Password reset.",
    });
  } catch (e) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = resetPassword;
