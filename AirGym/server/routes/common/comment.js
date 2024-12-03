const { commentSchema } = require("../../validations/common");
const { db } = require("../../lib/db");

const createComment = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = commentSchema.safeParse(data);

    // if data not validated
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // check if user data exists
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // get post id
    const postId = req.params.id;

    // if post id not exist
    if (!postId) {
      return res.status(400).json({
        error: "Post id is required.",
      });
    }

    // if exist add new post
    if (user) {
      await db.comment.create({
        data: {
          authorId: user.id,
          postId: postId,
          content: validatedData.data.content,
        },
      });
    } else {
      return res.status(400).json({
        error: "Please login first.",
      });
    }

    return res.status(200).json({
      message: "Comment created successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = commentSchema.safeParse(data);
    // get post id
    const commentId = req.params.id;

    // if data not validated
    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.errors,
      });
    }

    // if post id not exist
    if (!commentId) {
      return res.status(400).json({
        error: "Comment id is required.",
      });
    }

    // check if user data exists
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // user is not exist
    if (!user) {
      return res.status(400).json({
        error: "Please login first.",
      });
    }

    // get comment data
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    // check if comment exists
    if (!comment) {
      return res.status(400).json({
        error: "Comment not found.",
      });
    }

    // comment exist but user is not the author
    if (comment.authorId !== user.id) {
      return res.status(400).json({
        error: "You are not the author of this comment.",
      });
    }

    // update post
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: validatedData.data.content,
      },
    });

    return res.status(200).json({
      message: "Comment updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    // get comment id
    const commentId = req.params.id;

    // if comment id not exist
    if (!commentId) {
      return res.status(400).json({
        error: "Comment id is required.",
      });
    }

    // check if user data exists
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // user is not exist
    if (!user) {
      return res.status(400).json({
        error: "Please login first.",
      });
    }

    // get comment data
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    // if comment not exist
    if (!comment) {
      return res.status(400).json({
        error: "Comment not found.",
      });
    }

    // comment exist but user is not the author
    if (comment.authorId !== user.id) {
      return res.status(400).json({
        error: "You are not the author of this comment.",
      });
    }

    // delete new post
    await db.comment.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
