const { postSchema } = require("../../validations/common");
const { db } = require("../../lib/db");

const getPostsByUser = async (req, res) => {
  try {
    // check pagination data
    const { page, limit } = req.query;
    // get user id
    const id = req.user?.id;

    const pageNumber = parseInt(page) || 1;
    // get data from database with pagination and order by created date
    const posts = await db.post.findMany({
      take: parseInt(limit) || 10,
      skip: (pageNumber - 1) * (parseInt(limit) || 10),
      where: {
        authorId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            profileImage: true,
            username: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
                profileImage: true,
              },
            },
          },
        },
        likes: {
          where: {
            userId: id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const getPostsByID = async (req, res) => {
  try {
    // get post id
    const postId = req.params?.id;
    // get user id
    const id = req.user?.id;

    // if post id not exist
    if (!postId) {
      return res.status(400).json({
        error: "Post id is required.",
      });
    }

    // get post data
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            profileImage: true,
            username: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
                profileImage: true,
              },
            },
          },
        },
        likes: {
          where: {
            userId: id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return res.status(200).json({
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const createPost = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = postSchema.safeParse(data);

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

    // if exist add new post
    if (user) {
      await db.post.create({
        data: {
          authorId: user.id,
          content: validatedData.data.content,
          title: validatedData.data.title,
          image: "/uploads/feed" + req?.file?.filename,
        },
      });
    } else {
      return res.status(400).json({
        error: "Please login first.",
      });
    }

    return res.status(200).json({
      message: "Post created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;
    // validate data
    const validatedData = postSchema.safeParse(data);
    // get post id
    const postId = req.params.id;

    // if post id not exist
    if (!postId) {
      return res.status(400).json({
        error: "Post id is required.",
      });
    }

    // check if user data exists
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // if user data not exists
    if (!user) {
      return res.status(400).json({
        error: "Please login first.",
      });
    }

    // get post data
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    // if post not exist
    if (!post) {
      return res.status(400).json({
        error: "Post not found.",
      });
    }

    // if post exist but user is not owner
    if (post.userId !== user.id) {
      return res.status(400).json({
        error: "You are not allowed to update this post.",
      });
    }

    // update post
    await db.post.update({
      where: {
        id: req.params.id,
      },
      data: {
        userId: user.id,
        content: validatedData.data.content,
        title: validatedData.data.title,
        image: req.file.filename,
      },
    });

    return res.status(200).json({
      message: "Post updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    // get post id
    const postId = req.params.id;

    // if post id not exist
    if (!postId) {
      return res.status(400).json({
        error: "Post id is required.",
      });
    }

    // check if user data exists
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // if user data not exists
    if (!user) {
      return res.status(400).json({
        error: "Please login first.",
      });
    }

    // get post data
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    // if post not exist
    if (!post) {
      return res.status(400).json({
        error: "Post not found.",
      });
    }

    // if post exist but user is not owner
    if (post.authorId !== user.id) {
      return res.status(400).json({
        error: "You are not allowed to delete this post.",
      });
    }

    // delete post
    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const addOrRemoveLike = async (req, res) => {
  try {
    // get post id
    const postId = req.params.id;

    // if post id not exist
    if (!postId) {
      return res.status(400).json({
        error: "Post id is required.",
      });
    }

    // if post id is not undefined
    if (postId === "undefined") {
      return res.status(400).json({
        error: "Post id is required.",
      });
    }

    // check if user data exists
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // if user data not exists
    if (!user) {
      return res.status(400).json({
        error: "Please login first.",
      });
    }

    // get post data
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    // if post not exist
    if (!post) {
      return res.status(400).json({
        error: "Post not found.",
      });
    }

    // check if user already liked the post
    const like = await db.like.findFirst({
      where: {
        userId: user.id,
        postId: postId,
      },
    });

    // if user already liked the post
    if (like) {
      // remove like
      await db.like.delete({
        where: {
          id: like.id,
        },
      });

      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
              profileImage: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  firstName: true,
                  lastName: true,
                  role: true,
                  profileImage: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return res.status(200).json({
        message: "Like removed successfully.",
        post,
      });
    } else {
      // add like
      await db.like.create({
        data: {
          userId: user.id,
          postId: postId,
        },
      });

      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
              profileImage: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  firstName: true,
                  lastName: true,
                  role: true,
                  profileImage: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      return res.status(200).json({
        message: "Like added successfully.",
        post,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostsByUser,
  addOrRemoveLike,
  getPostsByID,
};
