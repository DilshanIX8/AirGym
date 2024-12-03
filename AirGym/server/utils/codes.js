const { db } = require("../lib/db");

// generate verification code function
const generateVerificationCode = async (email) => {
  let verificationCode;
  while (true) {
    // generate 6 number verification code
    verificationCode = Math.floor(100000 + Math.random() * 900000);
    // check if verification code already exists
    const existingCode = await db.verificationCodes.findFirst({
      where: {
        code: verificationCode.toString(),
      },
    });
    if (!existingCode) {
      break;
    }
  }
  // expire verification code after 1 hour
  const expireAt = new Date(Date.now() + 3600 * 1000);

  // check if user already has verification code
  const existingCode = await db.verificationCodes.findFirst({
    where: {
      email,
    },
  });

  // if user already has verification code delete it
  if (existingCode) {
    await db.verificationCodes.delete({
      where: {
        email,
      },
    });
  }

  // create new verification code
  await db.verificationCodes.create({
    data: {
      email,
      code: verificationCode.toString(),
      expires: expireAt,
    },
  });

  return verificationCode;
};

// generate reset password code function
const generatePasswordRestCode = async (email) => {
  let passwordResetCode;
  while (true) {
    // generate 6 number verification code
    passwordResetCode = Math.floor(100000 + Math.random() * 900000);
    // check if verification code already exists
    const existingCode = await db.passwordResetCode.findFirst({
      where: {
        code: passwordResetCode.toString(),
      },
    });
    if (!existingCode) {
      break;
    }
  }
  // expire verification code after 1 hour
  const expireAt = new Date(Date.now() + 3600 * 1000);

  // check if user already has verification code
  const existingCode = await db.passwordResetCode.findFirst({
    where: {
      email,
    },
  });

  // if user already has verification code delete it
  if (existingCode) {
    await db.passwordResetCode.delete({
      where: {
        email,
      },
    });
  }

  // create new verification code
  await db.passwordResetCode.create({
    data: {
      email,
      code: passwordResetCode.toString(),
      expires: expireAt,
    },
  });

  return passwordResetCode;
};

module.exports = { generateVerificationCode, generatePasswordRestCode };
