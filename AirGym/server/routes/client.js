const express = require("express");
const {
  createPendingSession,
  completeSessionReservation,
  updateTimeSlot,
} = require("./client/session/create-session");
const { addFigureData } = require("./client/analytics/add-figure-data");
const { getUserAnalytics } = require("./client/analytics/get-analytics");
const { getSession } = require("./client/session/get-session");
const { finishSession } = require("./client/session/finish-session");
const router = express.Router();

router.get("/session", async (req, res) => {
  return await getSession(req, res);
});

router.post("/session", async (req, res) => {
  return await createPendingSession(req, res);
});

router.post("/session/payment", async (req, res) => {
  return await completeSessionReservation(req, res);
});

router.post("/session/finish/:id", async (req, res) => {
  return await finishSession(req, res);
});

router.put("/session/:id", async (req, res) => {
  return await updateTimeSlot(req, res);
});

router.post("/figure", async (req, res) => {
  return await addFigureData(req, res);
});

router.get("/analytics/:username/:type?", async (req, res) => {
  return await getUserAnalytics(req, res);
});

module.exports = router;
