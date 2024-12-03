const express = require("express");
const router = express.Router();
const multer = require("multer");
const { updateBasicProfile, uploadProPic } = require("./common/update-profile");
const {
  updatePost,
  createPost,
  deletePost,
  addOrRemoveLike,
  getPostsByUser,
  getPostsByID,
} = require("./common/post");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("./common/comment");
const { getAuthUser } = require("./common/get-auth-user");
const { cancelSession } = require("./common/cancel-session");
const { getMessages } = require("./common/get-messages");
const { sendMessage } = require("./common/send-message");
const { getChatUsers } = require("./common/get-chat-users");
const {
  getUnreadIssuesCount,
  getIssues,
  getIssueById,
  createIssue,
} = require("./common/issues");
const { createFeedback } = require("./common/feedback");

// custom error handling middleware for Multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // handle multer-specific errors
    res.status(400).send({ error: err.message });
  } else if (err) {
    // handle other errors
    res.status(500).send({ error: "An unexpected error occurred" });
  } else {
    next(); // no errors, proceed to the next middleware
  }
};

// storage for user profile image
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, `/${req.user.email}_${file.originalname}`);
  },
});

// storage for feed image
const feedStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/feed");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `/${req.user.email}_${Date.now()}_${file.originalname}`
    );
  },
});
const uploadUser = multer({ storage: userStorage });
const uploadFeed = multer({ storage: feedStorage });

//logout route
router.post("/logout", (_, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logout successfully" });
});

// get user data route
router.get("/user", async (req, res) => {
  return await getAuthUser(req, res);
});

router.post("/profile", async (req, res) => {
  return await updateBasicProfile(req, res);
});

router.post(
  "/image",
  uploadUser.single("profileImage"),
  multerErrorHandler,
  async (req, res) => {
    return await uploadProPic(req, res);
  }
);

router.get("/post", async (req, res) => {
  return await getPostsByUser(req, res);
});

router.get("/post/:id", async (req, res) => {
  return await getPostsByID(req, res);
});

router.post(
  "/post",
  uploadFeed.single("feed"),
  multerErrorHandler,
  async (req, res) => {
    return await createPost(req, res);
  }
);

router.put(
  "/post/:id",
  uploadFeed.single("feed"),
  multerErrorHandler,
  async (req, res) => {
    return await updatePost(req, res);
  }
);

router.delete("/post/:id", async (req, res) => {
  return await deletePost(req, res);
});

router.post("/comment/:id", async (req, res) => {
  return await createComment(req, res);
});

router.put("/comment/:id", async (req, res) => {
  return await updateComment(req, res);
});

router.delete("/comment/:id", async (req, res) => {
  return await deleteComment(req, res);
});

router.post("/like/:id", async (req, res) => {
  return await addOrRemoveLike(req, res);
});

router.delete("/session/:id", async (req, res) => {
  return await cancelSession(req, res);
});
router.get("/chat", async (req, res) => {
  return await getChatUsers(req, res);
});

router.get("/chat/:id", async (req, res) => {
  return await getMessages(req, res);
});

router.post("/chat/send/:username", async (req, res) => {
  return await sendMessage(req, res);
});

router.get("/issues/unread", async (req, res) => {
  return await getUnreadIssuesCount(req, res);
});

router.get("/issues", async (req, res) => {
  return await getIssues(req, res);
});

router.get("/issues/:issueId", async (req, res) => {
  return await getIssueById(req, res);
});

router.post("/issues", async (req, res) => {
  return await createIssue(req, res);
});

router.post("/feedback", async (req, res) => {
  return await createFeedback(req, res);
});

module.exports = router;
