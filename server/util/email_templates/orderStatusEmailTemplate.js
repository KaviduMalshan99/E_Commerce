const orderStatusEmailTemplate = (toName, orderID, productName, status) => `
<!DOCTYPE html>
<html>
<head>
    <title>Order Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { padding: 20px; }
        .message { color: #333366; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="message">Order Status Update</h1>
        <p>Dear ${toName},</p>
        <p>We are reaching out to inform you about the current status of your order.</p>
        <p>Please see the details below:</p>
        <ul>
            <li>Order ID: ${orderID}</li>
            <li>Product ID: ${productId}</li>
            <li>Status: ${status}</li>
        </ul>
        <p>Please come and pick up your order.</p>
        <br />
        <p>Thank you for choosing us.</p>
        <p>WellWorn SL</p>
    </div>
</body>
</html>
`;

module.exports = orderStatusEmailTemplate;
