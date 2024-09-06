const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendEmail = async (refundDetails) => {
  // Destructure order details
  const { orderId, productIds, customerName, customerEmail, reason, refundDate, imgUrls } = refundDetails;

  try {
    // Create a secure transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nirmalsubashana3@gmail.com',
        pass: 'xibv nzlv izdg unem' // Use your app password here
      }
    });

    // HTML content for customer
    const customerHtmlContent = `
      <p>Dear ${customerName},</p>
      <p>Thank you for choosing to shop with us. This email is to confirm that we have received your order with the following details:</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Product ID:</strong> ${productIds}</p>
      <p><strong>Reason for Refunding:</strong> ${reason}</p>
      <p><strong>Date of refund request:</strong> ${refundDate}</p>
      <p><strong>Product Details:</strong></p>
      <p>We've attached an image of the product you've requested a refund.</p>
      <p>Please note that your refund is now being processed and will be notified to the provided email address within the time frame.</p>
      <p>If you have any questions or require further assistance, feel free to contact us at wellworn@gmail.com or reply directly to this email.</p>
      <p>Thank you once again for your purchase. We appreciate your business and look forward to serving you again in the future.</p>
      <p>Warm regards,</p>
      <p>WellWorn Private Limited</p>
    `;

    // HTML content for admin
    const adminHtmlContent = `
      <p>Dear Admin,</p>
      <p>A new refund request has been received with the following details:</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Product ID:</strong> ${productIds}</p>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Customer Email:</strong> ${customerEmail}</p>
      <p><strong>Reason for Refunding:</strong> ${reason}</p>
      <p><strong>Date of refund request:</strong> ${refundDate}</p>
      <p><strong>Product Details:</strong></p>
      <p>An image of the product is attached for your reference.</p>
      <p>Please take the necessary actions to process this refund.</p>
      <p>Best regards,</p>
      <p>WellWorn Private Limited</p>
    `;

    // Mail options for customer
    const customerMailOptions = {
      from: '"WellWorn Private Limited" <nirmalsubashana3@gmail.com>',
      to: customerEmail,
      subject: `Refund Request Confirmation - ${orderId}`,
      html: customerHtmlContent,
      attachments: imgUrls.map((dataUrl, index) => ({
        filename: `RefundImage_${index}.jpg`, // Generate unique filenames
        content: Buffer.from(dataUrl.split(';base64,').pop(), 'base64'), // Convert data URL to Buffer
        cid: `productimage_${index}` // Unique CID for each image
      }))
    };

    // Mail options for admin
    const adminMailOptions = {
      from: '"WellWorn Private Limited" <nirmalsubashana3@gmail.com>',
      to: 'nirmalsubashana3@gmail.com',
      subject: `New Refund Request - ${orderId}`,
      html: adminHtmlContent,
      attachments: imgUrls.map((dataUrl, index) => ({
        filename: `RefundImage_${index}.jpg`, // Generate unique filenames
        content: Buffer.from(dataUrl.split(';base64,').pop(), 'base64'), // Convert data URL to Buffer
        cid: `productimage_${index}` // Unique CID for each image
      }))
    };

    // Send email to customer
    await transporter.sendMail(customerMailOptions);
    console.log("Customer email sent successfully");

    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent successfully");

  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
