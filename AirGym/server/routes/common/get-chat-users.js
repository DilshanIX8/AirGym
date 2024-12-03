const { db } = require("../../lib/db");

const getChats = async (id, search) => {
  // get users who have chatted with the current user
  const users = await db.conversation.findMany({
    where: {
      OR: [
        {
          senderId: id,
        },
        {
          receiverId: id,
        },
      ],
      // search by sender or receiver first name or last name
      AND: search
        ? [
            {
              OR: [
                {
                  sender: {
                    firstName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  sender: {
                    lastName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  receiver: {
                    firstName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  receiver: {
                    lastName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            },
          ]
        : [],
    },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      sender: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          profileImage: true,
        },
      },
      receiver: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          profileImage: true,
        },
      },
      // get last message
      messages: {
        select: {
          message: true,
          createdAt: true,
          sender: true,
          receiver: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return users;
};

const getChatUsers = async (req, res) => {
  try {
    // get user id from req.user
    const id = req.user.id;
    // get search query from req.query
    const { search } = req.query;
    const users = await getChats(id, search);
    res.status(200).json({ users });
  } catch (error) {
    console.log("Error in getUsersForSidebar controller", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { getChatUsers, getChats };
