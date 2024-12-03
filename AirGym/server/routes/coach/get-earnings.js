const { db } = require("../../lib/db");
const PDFDocument = require("pdfkit-table");

const getCoachEarnings = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // get coach id from coach table
    const coach = await db.coach.findUnique({
      where: {
        userId: id,
      },
    });

    // get last 30 days earnings of the coach
    const earnings = await db.session.findMany({
      where: {
        coachId: coach.id,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 90)),
        },
        status: {
          in: ["RESERVED", "ACCEPTED", "FINISHED"],
        },
      },
      select: {
        createdAt: true,
        payment: {
          select: {
            amount: true,
            fee: true,
            remaining: true,
            type: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // return earnings
    res.status(200).json({ earnings });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getCoachEarningsPDF = async (req, res) => {
  try {
    // get user id from req.user
    const { id } = req.user;
    // get coach id from coach table
    const coach = await db.coach.findUnique({
      where: {
        userId: id,
      },
      include: {
        user: true,
      },
    });

    // get last 30 days earnings of the coach
    const earnings = await db.session.findMany({
      where: {
        coachId: coach.id,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 90)),
        },
        status: {
          in: ["RESERVED", "ACCEPTED", "FINISHED"],
        },
      },
      select: {
        createdAt: true,
        payment: {
          select: {
            amount: true,
            fee: true,
            remaining: true,
            type: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // init document
    let doc = new PDFDocument({ margin: 15, size: "A4" });

    // add pdf title and metadata
    doc.info.Title = "Coach Earnings";
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
      .text("Coach Earnings", { align: "center" });
    doc.fontSize(8).fillColor("#686D76").text("Last 90 days earnings", {
      align: "center",
    });

    // coach name
    const name = `${coach.user.firstName} ${coach.user.lastName}`;
    doc.fillColor("#000000").text(`Coach: ${name}`, { align: "start" });
    // start date
    doc.text(
      `Start Date: ${new Date(
        new Date().setDate(new Date().getDate() - 90)
      ).toDateString()}`,
      { align: "start" }
    );
    // end date
    doc.text(`End Date: ${new Date().toDateString()}`, { align: "start" });
    // total withdrawn amount and total earnings
    let totalWithdrawn = 0;
    let totalEarnings = 0;
    earnings.forEach((earning) => {
      if (earning.payment.type === "SESSION") {
        totalEarnings = earning.payment.remaining;
      }
    });

    // count total withdrawn from withdrawals table
    const withdrawals = await db.withdrawals.findMany({
      where: {
        coachId: coach.id,
        status: "FINISHED",
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 90)),
        },
      },
      select: {
        amount: true,
      },
    });

    withdrawals.forEach((withdrawal) => {
      totalWithdrawn += withdrawal.amount;
    });

    // total remaining amount
    const availableForWithdrawal = coach.availableForWithdrawal;
    doc.moveDown();

    doc
      .fontSize(10)
      .fillColor("#000000")
      .text(`Total Earnings (LKR): ${totalEarnings.toFixed(2)}`, {
        align: "start",
      });

    doc
      .fontSize(10)
      .fillColor("#000000")
      .text(`Total Withdrawn (LKR) : ${totalWithdrawn.toFixed(2)}`, {
        align: "start",
      });

    doc
      .fontSize(10)
      .fillColor("#000000")
      .text(
        `Available for Withdrawal (LKR) : ${availableForWithdrawal.toFixed(2)}`,
        {
          align: "start",
        }
      );

    doc.moveDown();

    // add table to pdf document
    doc.moveDown();
    doc.table(
      {
        headers: ["Client", "Date", "Type", "Amount", "Fee", "Remaining"],
        rows: earnings.map((earning) => [
          `${earning.user.firstName} ${earning.user.lastName}`,
          new Date(earning.createdAt).toDateString(),
          earning.payment.type.replaceAll("_", " "),
          earning.payment.amount,
          earning.payment.fee,
          earning.payment.remaining,
        ]),
      },
      {
        // change row background color if type is not session
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(8);
          row[2] !== "SESSION" && doc.addBackground(rectRow, "#ff0000");
        },
      }
    );
    res.setHeader(
      "Content-disposition",
      `attachment; filename= "${new Date().getTime()}_earnings.pdf"`
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    // finalize pdf document
    doc.end();
    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getCoachEarnings, getCoachEarningsPDF };
