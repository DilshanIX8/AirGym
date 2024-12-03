const { getUser } = require("../../utils/users");

const getAuthUser = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = { getAuthUser };
