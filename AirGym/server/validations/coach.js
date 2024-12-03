const { z } = require("zod");

const coachProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Name field has to be filled." })
    .max(50, { message: "Name should contain maximum 50 characters." }),
  lastName: z
    .string()
    .min(1, { message: "Name field has to be filled." })
    .max(50, { message: "Name should contain maximum 50 characters." }),
  email: z.string().email("This is not a valid email."),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number should contain minimum 10 digits." })
    .max(12, {
      message: "Phone number should contain maximum 12 digits.",
    }),
  birthday: z.coerce
    .date()
    .max(new Date(), { message: "Birthday should be in the past." }),
  address: z
    .string()
    .min(1, { message: "Address field has to be filled." })
    .max(150, { message: "Address should contain maximum 100 characters." }),
  idNumber: z
    .string()
    .min(1, { message: "ID number field has to be filled." })
    .max(12, { message: "ID number should contain maximum 12 characters." }),
});

const coachProfessionalDetailsSchema = z
  .object({
    oneSessionFee: z.coerce
      .number({ invalid_type_error: "Please enter one month fee" })
      .refine((val) => val !== undefined, {
        message: "one month fee field has to be filled.",
      })
      .refine((val) => !isNaN(val), {
        message: "one month fee must be a number",
      }),
    startTimeSlot: z.coerce
      .number({ invalid_type_error: "Please select a start time slot" })
      .refine((val) => val !== undefined, {
        message: "Start time slot field has to be filled.",
      })
      .refine((val) => !isNaN(val), {
        message: "Start time slot must be a number",
      }),
    endTimeSlot: z.coerce
      .number({ invalid_type_error: "Please select a end time slot" })
      .refine((val) => val !== undefined, {
        message: "End time slot field has to be filled.",
      })
      .refine((val) => !isNaN(val), {
        message: "End time slot must be a number",
      }),
    experience: z.enum(
      [
        "BELOW_1_YEAR",
        "ONE_TO_THREE_YEARS",
        "THREE_TO_FIVE_YEARS",
        "ABOVE_FIVE_YEARS",
      ],
      {
        errorMap: (_, ctx) => {
          return {
            message: ctx.defaultError.split(".")[1],
          };
        },
      }
    ),
    description: z
      .string()
      .min(1, { message: "Description field has to be filled." })
      .max(500, {
        message: "Description should contain maximum 500 characters.",
      }),
  })
  .refine((data) => data.startTimeSlot < data.endTimeSlot, {
    message: "Start time slot should be less than end time slot",
  });

const coachPaymentDetailsSchema = z.object({
  accountHolderName: z
    .string()
    .min(1, { message: "Account holder name field has to be filled." })
    .max(50, {
      message: "Account holder name should contain maximum 50 characters.",
    }),
  nameOfBank: z
    .string()
    .min(1, { message: "Name of bank field has to be filled." })
    .max(50, { message: "Name of bank should contain maximum 50 characters." }),
  accountNumber: z
    .string()
    .min(1, { message: "Account number field has to be filled." })
    .max(50, {
      message: "Account number should contain maximum 50 characters.",
    }),
  branch: z
    .string()
    .min(1, { message: "Branch field has to be filled." })
    .max(50, {
      message: "Branch should contain maximum 50 characters.",
    }),
});

const sessionAcceptSchema = z.object({
  url: z.string().url(),
});

module.exports = {
  coachProfileSchema,
  coachProfessionalDetailsSchema,
  coachPaymentDetailsSchema,
  sessionAcceptSchema,
};
