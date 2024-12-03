const { updateBasicProfileSchema } = require("../../validations/common");
const { db } = require("../../lib/db");
const { getUser } = require("../../utils/users");

const uploadProPic = async (req, res) => {
  try {
    // check if user data exists
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // if exist data update
    if (user) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          profileImage: "/uploads/users" + req.file.filename,
        },
      });
    } else {
      return res.status(400).json({
        error: "Please submit your profile details first.",
      });
    }

    const updatedUser = await getUser(req.user.id);

    return res.status(200).json({
      message: "Images uploaded successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const updateBasicProfile = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = updateBasicProfileSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // get validated data
    const { firstName, lastName, email, phoneNumber } = validatedData.data;

    const updatedProfile = await db.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    });

    if (!updatedProfile) {
      return res.status(400).json({
        error: "Failed to update profile.",
      });
    }

    // get user data
    const user = await getUser(req.user.id);

    return res.status(200).json({
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  uploadProPic,
  updateBasicProfile,
};
