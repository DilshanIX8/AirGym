const { getUserByUsername } = require("../../utils/users");

const getUsersByUsername = async (req, res) => {
  try {
    const user = await getUserByUsername(
      req.params.username,
      req.user?.id || undefined
    );
    if (!user) {
      return res.status(400).json({
        error: "User not found.",
      });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = { getUsersByUsername };
