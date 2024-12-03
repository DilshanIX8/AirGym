const express = require("express");
const {
  approveCoachAccount,
  getPendingCoachAccounts,
  rejectCoachAccount,
} = require("./admin/coach-approvals");
const {
  getUnreadIssues,
  submitResponse,
  getIssueById,
} = require("./admin/manage-issues");
const { getFeedbacks } = require("./admin/get-feedbacks");
const { getPosts, deletePost } = require("./admin/posts");
const { getUsers, deleteUser } = require("./admin/users");
const { getSystemStatistics } = require("./admin/statistics");
const {
  getWithdrawalAvailableCoaches,
  getWithdrawalAvailableCoachesPDF,
} = require("./admin/get-withdrawal-available-coaches");
const { withdrawFundsToCoaches } = require("./admin/withdraw-funds");
const { getSessions } = require("./admin/get-sessions");
const router = express.Router();

router.get("/coach-approvals", async (req, res) => {
  return await getPendingCoachAccounts(req, res);
});

router.post("/coach-approvals/:coachId", async (req, res) => {
  return await approveCoachAccount(req, res);
});

router.post("/coach-rejections/:coachId", async (req, res) => {
  return await rejectCoachAccount(req, res);
});

router.get("/issues", async (req, res) => {
  return await getUnreadIssues(req, res);
});

router.get("/issues/:issueId", async (req, res) => {
  return await getIssueById(req, res);
});

router.post("/issues/:issueId", async (req, res) => {
  return await submitResponse(req, res);
});

router.get("/feedback", async (req, res) => {
  return await getFeedbacks(req, res);
});

router.get("/posts", async (req, res) => {
  return await getPosts(req, res);
});

router.delete("/posts/:postId", async (req, res) => {
  return await deletePost(req, res);
});

router.get("/users", async (req, res) => {
  return await getUsers(req, res);
});

router.delete("/users/:userId", async (req, res) => {
  return await deleteUser(req, res);
});

router.get("/statistics", async (req, res) => {
  return await getSystemStatistics(req, res);
});

router.get("/withdrawal-available-coaches", async (req, res) => {
  return await getWithdrawalAvailableCoaches(req, res);
});

router.get("/withdrawal-available-coaches/pdf", async (req, res) => {
  return await getWithdrawalAvailableCoachesPDF(req, res);
});

router.post("/withdraw-funds", async (req, res) => {
  return await withdrawFundsToCoaches(req, res);
});

router.get("/sessions", async (req, res) => {
  return await getSessions(req, res);
});

module.exports = router;
