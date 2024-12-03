const express = require("express");
const {
  submitProfileDetails,
  submitCoachImages,
  submitPaymentDetails,
  submitProfessionalDetails,
  finishCoachProfile,
} = require("./coach/submit-details");
const { db } = require("../lib/db");
const multer = require("multer");
const { getClientAnalytics } = require("./coach/analytics/get-analytics");
const { getSessions } = require("./coach/session/get-sessions");
const { acceptSession } = require("./coach/session/accept-session");
const { getClients } = require("./coach/get-clients");
const { getCoachStatistics } = require("./coach/statistics");
const { getCoachEarnings, getCoachEarningsPDF } = require("./coach/get-earnings");
const router = express.Router();

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads/coaches");
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "cameraImage")
      return cb(null, `/${req.user.email}_${Date.now()}_camera.jpg`);
    else
      return cb(null, `/${req.user.email}_${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const coach = await db.coach.findUnique({
    where: {
      userId: req.user.id,
    },
    include: {
      paymentAccount: true,
    },
  });
  res.json({
    coach,
  });
});

router.post("/profile", async (req, res) => {
  return await submitProfileDetails(req, res);
});

router.post(
  "/images",
  upload.fields([
    { name: "IdFrontImage", maxCount: 1 },
    { name: "IdBackImage", maxCount: 1 },
    { name: "cameraImage", maxCount: 1 },
    { name: "certificate", maxCount: 5 },
  ]),
  multerErrorHandler,
  async (req, res) => {
    return await submitCoachImages(req, res);
  }
);

router.post("/payment", async (req, res) => {
  return await submitPaymentDetails(req, res);
});

router.post("/professional", async (req, res) => {
  return await submitProfessionalDetails(req, res);
});

router.post("/finish-profile", async (req, res) => {
  return await finishCoachProfile(req, res);
});

router.get("/analytics/:username/:type?", async (req, res) => {
  return await getClientAnalytics(req, res);
});

router.get("/session", async (req, res) => {
  return await getSessions(req, res);
});

router.post("/session/:id", async (req, res) => {
  return await acceptSession(req, res);
});

router.get("/clients", async (req, res) => {
  return await getClients(req, res);
});

router.get("/earnings", async (req, res) => {
  return await getCoachEarnings(req, res);
});

router.get("/earnings/pdf", async (req, res) => {
  return await getCoachEarningsPDF(req, res, true);
});

router.get("/statistics", async (req, res) => {
  return await getCoachStatistics(req, res);
});

module.exports = router;
