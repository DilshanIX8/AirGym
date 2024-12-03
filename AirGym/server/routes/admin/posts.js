const { db } = require("../../lib/db");

// get post with search query
const getPosts = async (req, res) => {
  try {
    // get search from req.query
    const search = req.query.search || "";
    // if search is empty
    if (!search) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // get posts with search query
    const posts = await db.post.findMany({
      where: {
        OR: [
          // search by title
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          // or search by user firstName and lastName combined
          {
            author: {
              OR: [
                {
                  firstName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        ],
      },
      select: {
        id: true,
        authorId: true,
        image: true,
        content: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });
    // return posts
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

//delete post by id
const deletePost = async (req, res) => {
  try {
    // get post id from req.params
    const { postId } = req.params;
    // check post is available or not
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // delete post by id
    await db.post.delete({
      where: {
        id: postId,
      },
    });
    // return success message
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getPosts, deletePost };
