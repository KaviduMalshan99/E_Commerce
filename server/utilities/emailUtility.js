const nodemailer = require('nodemailer');
const path = require('path');

const sendEmaill = async (orderDetails) => {
    const {
        email,
        firstName,
        lastName,
        orderId,
        orderDate,
        address,
        city,
        postalCode,
        country,
        products
    } = orderDetails;

    const productDetails = products.map((product, index) => `
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="position: relative;">
                <img src="cid:productimage${product.productId}" alt="${product.ProductName}" width="100" style="border: 2px solid black; border-radius: 10px;" />
            </div>
            <div style="margin-left: 20px;">
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: black;">${product.ProductName}</p>
                <p style="margin: 0; font-size: 14px; color: #ff3c00;">${product.price.toFixed(2)}</p>
                <p style="margin: 0; font-size: 14px; color: black;">Size: ${product.size || 'Not specified'}, Color: ${product.color || 'Not specified'}</p>
                <p style="margin: 0; font-size: 14px; color: black;">Quantity: ${product.quantity}</p>
                <p style="margin: 0; font-size: 14px; color: black;">Total: ${(product.price * product.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    try {
        const transporter = nodemailer.createTransport({
            host: 'mail.wellworn.lk', // SMTP server address
            port: 465, // SMTP port
            secure: true, // true for port 465
            auth: {
                user: 'orders@wellworn.lk', // your new email address
                pass: '123wellhelp#$' // your email account password
            }
        });

        const mailOptions = {
            from: '"WellWorn Private Limited" <orders@wellworn.lk>',
            to: email,
            subject: `Order Confirmation - ${orderId}`,
            html: `
                <p>Dear ${firstName} ${lastName},</p>
                <p>Thank you for choosing to shop with us. This email is to confirm that we have received your order with the following details:</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Shipping Address:</strong><br>
                ${address},<br>
                ${city},<br>
                ${postalCode},<br>
                ${country}</p>
                <p><strong>Product Details:</strong></p>
                ${productDetails}
                <p>Please note that your order is now being processed and will be shipped to the provided address within the estimated delivery time frame. You will receive a separate email with tracking information once your order has been dispatched.</p>
                <p>If you have any questions or require further assistance, feel free to contact us at help@wellworn.lk or reply directly to this email.</p>
                <p>Thank you once again for your purchase. We appreciate your business and look forward to serving you again in the future.</p>
                <p>Warm regards,</p>
                <p>WellWorn Private Limited</p>
            `,
            attachments: products.map(product => ({
                filename: path.basename(product.image),
                path: product.image,
                cid: 'productimage' + product.productId
            }))
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendEmaill };
