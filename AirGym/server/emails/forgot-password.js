const forgotPasswordTemplate = (code, name) => {
  return `
    <!DOCTYPE html>
<html>
<head>
    <title>Forgot Password</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
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
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        h2 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 10px;
            color: #333;
            font-size: 16px;
        }
        .code {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            font-size: 36px;
            font-weight: bold;
            border-radius: 5px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Forgot Password</h2>
        <p>Hi ${name},</p>
        <p>Your verification code is:</p>
        <div class="code">${code}</div>
        <p>Please use this code to reset your password.</p>
        <p>If you did not request reset password, please ignore this email.</p>
        <p>Thank you!</p>
    </div>
</body>
</html>`;
};

module.exports = { forgotPasswordTemplate };
