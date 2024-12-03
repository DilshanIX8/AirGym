const bcrypt = require("bcryptjs");
const { registerSchema } = require("../../validations/auth");
const { generateVerificationCode } = require("../../utils/codes");
const { verifyEmailTemplate } = require("../../emails/verification");
const { sendEmail } = require("../../utils/emails");
const {
  getUserByEmail,
  getUserByPhoneNumber,
  getUserCountByFirstNameAndLastName,
} = require("../../utils/users");
const { db } = require("../../lib/db");

const register = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = registerSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // get data from validated data
    const { email, firstName, lastName, password, role, phoneNumber } =
      validatedData.data;
    // check if user with email already exists
    const user = await getUserByEmail(email);

    if (user) {
      // check account is deleted
      if (user.role === "DELETED") {
        return res.status(400).json({
          error: "This email is banned from the platform.",
        });
      }
      return res.status(400).json({
        error: "User with this email already exists.",
      });
    }

    // check if user with phone number already exists
    const userByPhoneNumber = await getUserByPhoneNumber(phoneNumber);

    if (userByPhoneNumber) {
      return res.status(400).json({
        error: "User with this phone number already exists.",
      });
    }

    // id no user found with email
    const hashedPassword = await bcrypt.hash(password, 10);

    // get user count by first name and last name
    const userCount = await getUserCountByFirstNameAndLastName(
      firstName,
      lastName
    );

    // create username
    const username =
      userCount > 0
        ? `${firstName}.${lastName}${userCount}`
        : `${firstName}.${lastName}`;

    // clear spaces and convert to lowercase
    const filteredUsername = username.replace(/\s/g, "").toLowerCase();

    // create user
    const newUser = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        phoneNumber,
        username: filteredUsername,
        password: hashedPassword,
      },
    });

    // create coach profile if user is coach
    if (role === "COACH") {
      await db.coach.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    // get verification code
    const verificationCode = await generateVerificationCode(email);

    // get verification email template
    const emailTemplate = verifyEmailTemplate(
      verificationCode,
      firstName + " " + lastName
    );

    // send email to user
    const isSuccess = sendEmail(
      email,
      "Email verification",
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
      error: e.message,
    });
  }
};

module.exports = register;
