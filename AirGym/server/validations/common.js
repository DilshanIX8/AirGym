const { z } = require("zod");

const MAX_UPLOAD_SIZE = 200000;
const MAX_MB = 2;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// email validation schema
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled." })
    .email("This is not a valid email."),
});

const imageSchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) => !file || file.size !== 0 || file.size <= MAX_UPLOAD_SIZE,
      `Max image size is ${MAX_MB}MB`
    )
    .refine(
      (file) =>
        !file || file.type === "" || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, and .png formats are supported"
    ),
  type: z.enum(
    ["profileImage", "idFrontImage", "idBackImage", "cameraPicImage", "feed"],
    {
      errorMap: (_, ctx_) => {
        return {
          message: "Invalid image type",
        };
      },
    }
  ),
});

// register schema
const updateBasicProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name field has to be filled." }),
  lastName: z.string().min(1, { message: "Last name field has to be filled." }),
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
});

// post schema
const postSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content field has to be filled." })
    .max(1000, {
      message: "Content field has to be less than 1000 characters.",
    }),
  title: z
    .string()
    .min(1, { message: "Title field has to be filled." })
    .max(100, {
      message: "Title field has to be less than 100 characters.",
    }),
});

//comment schema
const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content field has to be filled." })
    .max(500, {
      message: "Content field has to be less than 500 characters.",
    }),
});

module.exports = {
  emailSchema,
  imageSchema,
  updateBasicProfileSchema,
  postSchema,
  commentSchema,
};
