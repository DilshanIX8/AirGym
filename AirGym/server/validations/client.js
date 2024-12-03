const { z } = require("zod");

const sessionSchema = z.object({
  timeSlot: z.coerce
    .number({ invalid_type_error: "Please select a time slot" })
    .refine((val) => val !== undefined, {
      message: "Time slot field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Time slot must be a number",
    })
    .refine((val) => val >= 0 && val <= 23, {
      message: "Time slot must be between 12am - 01am and 11pm - 12am",
    }),
  username: z.string().min(1, { message: "Coach id field has to be filled." }),
});

const sessionPaymentSchema = z.object({
  sessionId: z
    .string()
    .min(1, { message: "Session id field has to be filled." }),
  payment: z.coerce
    .number({ invalid_type_error: "Please enter payment" })
    .refine((val) => val !== undefined, {
      message: "Payment field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Payment must be a number",
    })
    .refine((val) => val > 0, {
      message: "Payment must be greater than 0",
    }),
  paymentId: z
    .string()
    .min(1, { message: "Payment id field has to be filled." }),
});

const sessionUpdateSchema = z.object({
  timeSlot: z.coerce
    .number({ invalid_type_error: "Please select a time slot" })
    .refine((val) => val !== undefined, {
      message: "Time slot field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Time slot must be a number",
    })
    .refine((val) => val >= 0 && val <= 23, {
      message: "Time slot must be between 12am - 01am and 11pm - 12am",
    }),
});

const figureDataSchema = z.object({
  shoulders: z.coerce
    .number({ invalid_type_error: "Please enter shoulders" })
    .refine((val) => val !== undefined, {
      message: "Shoulders field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Shoulders must be a number",
    })
    .refine((val) => val > 0, {
      message: "Shoulders must be greater than 0",
    }),
  chest: z.coerce
    .number({ invalid_type_error: "Please enter chest" })
    .refine((val) => val !== undefined, {
      message: "Chest field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Chest must be a number",
    })
    .refine((val) => val > 0, {
      message: "Chest must be greater than 0",
    }),
  neck: z.coerce
    .number({ invalid_type_error: "Please enter neck" })
    .refine((val) => val !== undefined, {
      message: "Neck field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Neck must be a number",
    })
    .refine((val) => val > 0, {
      message: "Neck must be greater than 0",
    }),
  biceps: z.coerce
    .number({ invalid_type_error: "Please enter biceps" })
    .refine((val) => val !== undefined, {
      message: "Biceps field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Biceps must be a number",
    })
    .refine((val) => val > 0, {
      message: "Biceps must be greater than 0",
    }),
  thigh: z.coerce
    .number({ invalid_type_error: "Please enter thigh" })
    .refine((val) => val !== undefined, {
      message: "Thigh field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Thigh must be a number",
    })
    .refine((val) => val > 0, {
      message: "Thigh must be greater than 0",
    }),

  calf: z.coerce
    .number({ invalid_type_error: "Please enter calf" })
    .refine((val) => val !== undefined, {
      message: "Calf field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Calf must be a number",
    })
    .refine((val) => val > 0, {
      message: "Calf must be greater than 0",
    }),
  waist: z.coerce
    .number({ invalid_type_error: "Please enter waist" })
    .refine((val) => val !== undefined, {
      message: "Waist field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Waist must be a number",
    })
    .refine((val) => val > 0, {
      message: "Waist must be greater than 0",
    }),
  hip: z.coerce
    .number({ invalid_type_error: "Please enter hips" })
    .refine((val) => val !== undefined, {
      message: "Hips field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Hips must be a number",
    })
    .refine((val) => val > 0, {
      message: "Hips must be greater than 0",
    }),
  forearm: z.coerce
    .number({ invalid_type_error: "Please enter forearm" })
    .refine((val) => val !== undefined, {
      message: "Forearm field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Forearm must be a number",
    })
    .refine((val) => val > 0, {
      message: "Forearm must be greater than 0",
    }),
  height: z.coerce
    .number({ invalid_type_error: "Please enter height" })
    .refine((val) => val !== undefined, {
      message: "Height field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Height must be a number",
    })
    .refine((val) => val > 0, {
      message: "Height must be greater than 0",
    }),
  weight: z.coerce
    .number({ invalid_type_error: "Please enter weight" })
    .refine((val) => val !== undefined, {
      message: "Weight field has to be filled.",
    })
    .refine((val) => !isNaN(val), {
      message: "Weight must be a number",
    })
    .refine((val) => val > 0, {
      message: "Weight must be greater than 0",
    }),
});

const finishSessionSchema = z.object({
  review: z.optional(
    z.string().max(500, {
      message: "Review must be less than 500 characters",
    })
  ),
  rating: z.optional(
    z.coerce.number().refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    })
  ),
});

module.exports = {
  sessionSchema,
  sessionPaymentSchema,
  sessionUpdateSchema,
  figureDataSchema,
  finishSessionSchema,
};
