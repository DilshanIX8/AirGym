const { db } = require("../../lib/db");

const createFeedback = async (req, res) => {
  try {
    // get data from request body
    const { feedback } = req.body;
    // get user id from req.user
    const { id } = req.user;

    // if feedback not provided
    if (!feedback) {
      return res.status(400).json({
        error: "Feedback is required.",
      });
    }

    // if length of feedback is grater than 1000
    if (feedback.length > 1000) {
      return res.status(400).json({
        error: "Feedback must be less than 1000 characters.",
      });
    }

    // if exist add new feedback

    const createdFeedback = await db.feedback.create({
      data: {
        userId: id,
        feedback,
      },
    });

    // if feedback not created
    if (!createdFeedback) {
      return res.status(400).json({
        error: "Feedback not created.",
      });
    }

    return res.status(200).json({
      message: "Feedback created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  createFeedback,
};
