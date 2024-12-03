const { db } = require("../../lib/db");

// add issue
const createIssue = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // get issue from req.body
    const { issue } = req.body;
    // if issue is not provided
    if (!issue) {
      return res.status(400).json({ error: "Issue is required" });
    }

    // if length of issue is greater than 1000
    if (issue.length > 1000) {
      return res.status(400).json({
        error: "Issue must be less than 1000 characters.",
      });
    }

    // get last issue issueId to generate new issueId
    const lastIssue = await db.issue.findFirst({
      orderBy: {
        issueId: "desc",
      },
    });
    // generate new issueId
    const issueId = lastIssue ? lastIssue.issueId + 1 : 1;

    // create issue
    const newIssue = await db.issue.create({
      data: {
        userId: id,
        issueId,
        issue,
      },
    });

    // if issue isn't created
    if (!newIssue) {
      return res.status(400).json({ error: "Failed to submit issue" });
    }

    // return success message
    res.json({ message: "Issue submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get user unread issues count
const getUnreadIssuesCount = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // get unread issues count
    const unread = await db.issue.count({
      where: {
        userId: id,
        isUserRead: false,
      },
    });
    // return unread issues count
    res.json({ unread });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get user's issues with pagination and order with user read status
const getIssues = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // get page from req.query
    let page = req.query.page || 1;
    // get limit from req.query
    const limit = req.query.limit || 25;
    // get total issues count
    const totalIssues = await db.issue.count({
      where: {
        userId: id,
      },
    });
    // get total pages
    const totalPages = Math.ceil(totalIssues / limit);
    // if page is greater than total pages
    if (page > totalPages) {
      page = totalPages;
    }
    // if page is less than 1
    if (page < 1) {
      page = 1;
    }
    // get issues
    const issues = await db.issue.findMany({
      where: {
        userId: id,
      },
      orderBy: [
        {
          isUserRead: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        issueId: true,
        issue: true,
        response: true,
        isUserRead: true,
        createdAt: true,
        updatedAt: true,
      },

      skip: (page - 1) * limit,
      take: limit,
    });
    // return issues
    res.json({ issues, totalPages, page });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get user issue by issueId
const getIssueById = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // get issueId from req.params
    const { issueId } = req.params;
    // get issue
    const issue = await db.issue.findFirst({
      where: {
        userId: id,
        issueId: parseInt(issueId),
      },
      select: {
        issueId: true,
        issue: true,
        response: true,
        isUserRead: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // if isUserRead is false
    if (issue.isUserRead === false) {
      // update isUserRead to true
      await db.issue.update({
        where: {
          issueId: parseInt(issueId),
        },
        data: {
          isUserRead: true,
        },
      });
    }

    // if issue not found
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    // return issue
    res.json({ issue });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { createIssue, getUnreadIssuesCount, getIssues, getIssueById };
