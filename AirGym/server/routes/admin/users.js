const { db } = require("../../lib/db");

// get users with search query
const getUsers = async (req, res) => {
  try {
    // get search from req.query
    const search = req.query.search || "";
    // if search is empty
    if (!search) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // get users with search query
    const users = await db.user.findMany({
      where: {
        OR: [
          // search by firstName
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          // or search by lastName
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
          // or search by email
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          // or search by username
          {
            username: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
        // not the role deleted or admin
        NOT: {
          role: {
            in: ["ADMIN"],
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        profileImage: true,
        coach: {
          select: {
            ratings: true,
          },
        },
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// delete user (update user role to deleted)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // check if user exists
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        coach: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // updated role
    let role = "DELETED";
    if (user.role === "DELETED" && user.coach !== null) {
      role = "COACH";
    } else if (user.role === "DELETED" && user.coach === null) {
      role = "CLIENT";
    }

    // update user role to deleted
    const updated = await db.user.update({
      where: {
        id: userId,
        NOT: {
          role: "ADMIN",
        },
      },

      data: {
        role: role,
      },
    });

    // if updated not found
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, deleteUser };
