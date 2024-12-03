const { db } = require("../../../lib/db");
const { figureDataSchema } = require("../../../validations/client");

const addFigureData = async (req, res) => {
  try {
    // get data
    const data = req.body;
    // validate data
    const validatedData = figureDataSchema.safeParse(data);

    if (!validatedData.success) {
      return res.status(400).json({ error: validatedData.error });
    }

    // check user is logged in
    const user = await db.user.findFirst({
      where: {
        id: req?.user.id,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "You are not logged in!" });
    }

    // check user is a client
    if (user.role !== "CLIENT") {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action!" });
    }

    // add data to database
    const figure = await db.figureDetails.create({
      data: {
        ...validatedData.data,
        userId: user.id,
      },
    });

    //check if figure data is added
    if (!figure) {
      return res.status(500).json({ error: "Something went wrong!" });
    }

    // send response
    res.status(200).json({ message: "Figure data added successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = { addFigureData };
