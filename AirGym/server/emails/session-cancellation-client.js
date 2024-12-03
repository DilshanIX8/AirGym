const sessionCancellationClientTemplate = (date, time, coach, name) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <title>Session Cancellation Confirmation</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #333;
        margin-bottom: 20px;
      }
      p {
        color: #333;
        font-size: 14px;
        line-height: 16px;
        margin-bottom: 3px;
      }
      .greetings {
        margin-bottom: 30px;
      }
      .footer {
        margin-top: 30px;
      }
      .msg {
        margin-bottom: 20px;
        margin-top: 20px;
      }
      .data {
        margin-left: 30px;
        font-style: italic;
      }
      .mail-to {
        margin-bottom: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Session Cancellation</h2>
      <p class="greetings">Hi ${name},</p>
      <p class="msg">
        Your session has been successfully cancelled. Here are the details:
      </p>
      <div class="data">
        <p>Session Date: ${date}</p>
        <p>Session Time: ${time}</p>
        <p>Session Coach: ${coach}</p>
      </div>
      <p class="msg">
        Your refund will be processed within sevaral hours . Please note that
        the refund may take longer to appear in your account depending on your
        bank.
      </p>
      <div class="footer">
        <p class="mail-to">
          If you have any questions or concerns, please don't hesitate to
          contact us at
          <a href="mailto:" style="color: #007bff">AirGym Customer Support </a>
        </p>
        <p style="color: #444444">Best regards,</p>
        <p style="color: #444444">Administration</p>
        <p style="color: #444444">AirGym platform</p>
      </div>
    </div>
  </body>
</html>
    `;
};

module.exports = { sessionCancellationClientTemplate };
