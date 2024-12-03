const { db } = require("../../lib/db");

// get all admin unread issues with pagination and order
const getUnreadIssues = async (req, res) => {
  try {
    // get page from req.query
    let page = req.query.page || 1;
    // get limit from req.query
    const limit = req.query.limit || 25;
    // get total issues count
    const totalIssues = await db.issue.count({
      where: {
        isAdminRead: false,
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
    const issues = await db.issue.findMany({
      where: {
        isAdminRead: false,
      },
      select: {
        issueId: true,
        issue: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    // return unread issues
    res.json({ issues, totalPages, page });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// submit admin response to issue
const submitResponse = async (req, res) => {
  try {
    const { issueId } = req.params; 
    const { response } = req.body;

    // if response not provided
    if (!response) {
      return res.status(400).json({
        error: "Response is required.",
      });
    }

    // if length of response is grater than 1000
    if (response.length > 1000) {
      return res.status(400).json({
        error: "Response is too long.",
      });
    }

    // update issue with response
    await db.issue.update({
      where: {
        issueId: Number(issueId),
      },
      data: {
        response,
        isAdminRead: true,
        isUserRead: false,
      },
    });
    // return success message
    res.json({ message: "Response submitted" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// get single issue by id
const getIssueById = async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = await db.issue.findUnique({
      where: {
        issueId: Number(issueId),
      },
      select: {
        issueId: true,
        issue: true,
        response: true,
        isAdminRead: true,
        isUserRead: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            role: true,
          },
        },
      },
    });
    // return issue
    res.json({ issue });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getUnreadIssues,
  submitResponse,
  getIssueById,
};
