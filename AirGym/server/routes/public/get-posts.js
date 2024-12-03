const { db } = require("../../lib/db");

const getPosts = async (req, res) => {
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

    // clear likes field if user is not logged in
    if (!id) {
      posts.forEach((post) => {
        post.likes = [];
      });
    }

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

module.exports = { getPosts };
