const { db } = require("../../lib/db.js");
const { getReceiverSocketId, io } = require("../../socket/socket.js");
const { getChats } = require("./get-chat-users.js");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { username } = req.params;
    const senderId = req.user.id;

    // check if the message is empty
    if (!message) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // if receiver id is null or undefined
    if (!username) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    // check if the receiver exists
    const receiver = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!receiver) {
      return res.status(400).json({ message: "Receiver does not exist" });
    }

    // get sender details
    const sender = await db.user.findUnique({
      where: {
        id: senderId,
      },
      select: {
        username: true,
      },
    });

    // check if conversation exists
    let conversation = await db.conversation.findFirst({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiver.id,
          },
          {
            senderId: receiver.id,
            receiverId: senderId,
          },
        ],
      },
    });

    // if conversation does not exist, create a new one
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          senderId,
          receiverId: receiver.id,
        },
      });
    }

    // if still conversation does not exist, return error
    if (!conversation) {
      return res.status(500).json({ message: "Something went wrong." });
    }

    // create a new message
    const newMessage = await db.message.create({
      data: {
        conversationId: conversation.id,
        message,
        sender: sender.username,
        receiver: receiver.username,
      },
    });

    // update conversation updated at
    await db.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    // get updated sidebar for receiver
    const usersForReceiver = await getChats(receiver.id, undefined);
    // get updated sidebar for sender
    const usersForSender = await getChats(senderId, undefined);

    const receiverSocketId = getReceiverSocketId(username);
    const senderSocketId = getReceiverSocketId(sender.username);
    if (receiverSocketId) {
      // send the message to the receiver
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("updatedSidebar", usersForReceiver);
    }
    if (senderSocketId) {
      // send the message to the sender
      io.to(senderSocketId).emit("updatedSidebar", usersForSender);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { sendMessage };
