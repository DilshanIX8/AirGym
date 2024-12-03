const { db } = require("../../lib/db");
const PDFDocument = require("pdfkit-table");

const getWithdrawalAvailableCoaches = async (req, res) => {
  try {
    const coaches = await db.coach.findMany({
      where: {
        coachVerified: "VERIFIED",
        availableForWithdrawal: {
          gt: 0,
        },
      },
      select: {
        availableForWithdrawal: true,
        user: {
          select: {
            email: true,
            phoneNumber: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.status(200).json({ coaches });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getWithdrawalAvailableCoachesPDF = async (req, res) => {
  try {
    const coaches = await db.coach.findMany({
      where: {
        coachVerified: "VERIFIED",
        availableForWithdrawal: {
          gt: 0,
        },
      },
      select: {
        availableForWithdrawal: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        paymentAccount: {
          select: {
            accountNumber: true,
            accountHolderName: true,
            nameOfBank: true,
            branch: true,
          },
        },
      },
    });

    let doc = new PDFDocument({ margin: 15, size: "A4" });

    // add pdf title and metadata
    doc.info.Title = "Available Coaches for Withdrawal";
    // add logo to pdf document
    doc.image("uploads/logo.png", 10, 10, { width: 50 });
    // generated date and time
    doc
      .fontSize(8)
      .fillColor("#686D76")
      .text(new Date().toDateString(), { align: "right" });
    doc.text(new Date().toLocaleTimeString(), { align: "right" });
    doc.moveDown(2);
    // add earnings to pdf document
    doc
      .fontSize(14)
      .fillColor("#000000")
      .text("Available Coaches for Withdrawal", { align: "center" });

    doc.moveDown();

    doc.table({
      headers: [
        "Name",
        "Amount (LKR)",
        "Account Number",
        "Account Holder Name",
        "Name of Bank",
        "Branch",
      ],
      rows: coaches.map((coach) => [
        `${coach.user.firstName} ${coach.user.lastName}`,
        coach.availableForWithdrawal,
        coach.paymentAccount.accountNumber,
        coach.paymentAccount.accountHolderName,
        coach.paymentAccount.nameOfBank,
        coach.paymentAccount.branch,
      ]),
    });
    res.setHeader(
      "Content-disposition",
      `attachment; filename= "${new Date().getTime()}_withdrawal_available_coaches.pdf"`
    );
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.end();
    res.status(200);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getWithdrawalAvailableCoaches,
  getWithdrawalAvailableCoachesPDF,
};
