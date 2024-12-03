const { z } = require("zod");

// login schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(1, { message: "Password field has to be filled." })
    .max(32, { message: "Password should contain maximum 32 characters." }),
});

// register schema
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name field has to be filled." }),
    lastName: z
      .string()
      .min(1, { message: "Last name field has to be filled." }),
    email: z
      .string()
      .min(1, { message: "Email field has to be filled." })
      .email("This is not a valid email."),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone number should contain minimum 10 digits." })
      .max(12, {
        message: "Phone number should contain maximum 12 digits.",
      }),
    password: z
      .string()
      .min(1, { message: "Password field has to be filled." })
      .max(32, { message: "Password should contain maximum 32 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password field has to be filled." })
      .max(32, {
        message: "Confirm Password should contain maximum 32 characters.",
      }),
    role: z.enum(["CLIENT", "COACH"], {
      message: "Role should be Client or Coach .",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// verify validation schema
const verificationSchema = z.object({
  code: z.string().length(6, { message: "Code should contain 6 characters." }),
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
});

// reset password schema
const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email field has to be filled." })
      .email("This is not a valid email."),
    code: z
      .string()
      .length(6, { message: "Code should contain 6 characters." }),
    password: z
      .string()
      .min(1, { message: "Password field has to be filled." })
      .max(32, { message: "Password should contain maximum 32 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password field has to be filled." })
      .max(32, {
        message: "Confirm Password should contain maximum 32 characters.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// forgot password email schema
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
});

module.exports = {
  loginSchema,
  registerSchema,
  verificationSchema,
  resetPasswordSchema,
  emailSchema,
};
