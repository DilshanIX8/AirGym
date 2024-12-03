const coachRejectedTemplate = (coach, url, reason) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <title>Account Approval Notification</title>
  </head>
  <body>
    <div
      style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif"
    >
      <h2 style="color: #444444">Hello ${coach},</h2>
      <p style="color: #444444">
        We regret to inform you that your coaching account has not been approved
        at this time.
      </p>
        <p style="color: #444444">
        Reason: ${reason}</p>
      <p style="color: #444444">
        In order to proceed, we kindly ask you to resubmit the required
        documents and details. Please ensure that all information is accurate
        and complete.
      </p>
      <a
        href="${url}/coach"
        style="
          background-color: #008cba;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border: none;
        "
        >Resubmit Documents</a
      >
      <p style="color: #444444">
        If you have any questions or need assistance, please don't hesitate to
        contact us.
      </p>
      <p style="color: #444444">Best regards,</p>
      <p style="color: #444444">Administration</p>
      <p style="color: #444444">AirGym platform</p>
    </div>
  </body>
</html>

    `;
};

module.exports = { coachRejectedTemplate };
