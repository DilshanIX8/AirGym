const { db } = require("../../lib/db.js");

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    // check if the conversation exists
    let conversation = await db.conversation.findUnique({
      where: {
        id,
      },
    });

    // if conversation does not exist, return empty array
    if (!conversation) {
      res.status(404).json({
        error: "Conversation not found",
      });
    }

    // get messages of the conversation
    const messages = await db.message.findMany({
      where: {
        conversationId: id,
      },
      select: {
        message: true,
        createdAt: true,
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = { getMessages };
