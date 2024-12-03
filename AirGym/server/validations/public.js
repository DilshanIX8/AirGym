const { z } = require("zod");

const filterCoachesSchema = z.object({
  experience: z.optional(
    z.enum(
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
    )
  ),
  ratings: z.optional(
    z.enum(["ONE_STAR", "TWO_STAR", "THREE_STAR", "FOUR_STAR", "FIVE_STAR"], {
      errorMap: (_, ctx) => {
        return {
          message: ctx.defaultError.split(".")[1],
        };
      },
    })
  ),
  price: z.optional(
    z.enum(["LOW_TO_HIGH", "HIGH_TO_LOW"], {
      errorMap: (_, ctx) => {
        return {
          message: ctx.defaultError.split(".")[1],
        };
      },
    })
  ),
});

const contactUsSchema = z.object({
  firstName: z
    .string()
    .min(1, {
      message: "First name should be at least 1 character long",
    })
    .max(50, {
      message: "First name should be at most 50 characters long",
    }),
  lastName: z
    .string()
    .min(1, {
      message: "Last name should be at least 1 character long",
    })
    .max(50, {
      message: "Last name should be at most 50 characters long",
    }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  subject: z
    .string()
    .min(1, {
      message: "Subject should be at least 1 character long",
    })
    .max(50, {
      message: "Subject should be at most 50 characters long",
    }),
  message: z
    .string()
    .min(10, {
      message: "Message should be at least 10 characters long",
    })
    .max(1000, {
      message: "Message should be at most 1000 characters long",
    }),
});

module.exports = { filterCoachesSchema, contactUsSchema };
