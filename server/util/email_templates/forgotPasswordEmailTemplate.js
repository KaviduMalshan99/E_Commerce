const forgotPasswordEmailTemplate = (userName, resetLink) => `
<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Requested</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { padding: 20px; }
        .message { color: #333366; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="message">Password Reset for Well Worn</h1>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password for your Well Worn account.</p>
        <p>Simply click on the link below to set up a new password:</p>
        <p><a href="${resetLink}">Reset your password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact us if you have any concerns.</p>
        <br />
        <p>Thank you,</p>
        <p>The Well Worn Team</p>
    </div>
</body>
</html>
`;

module.exports = forgotPasswordEmailTemplate;
