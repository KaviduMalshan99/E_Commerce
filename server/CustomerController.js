require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Customer = require("./CustomerModel");
const { response } = require("./app");
const bcrypt = require("bcryptjs");
const forgotPasswordEmailTemplate = require("./util/email_templates/forgotPasswordEmailTemplate");
const sendEmail = require("./util/sendEmail");

const admin = require("firebase-admin");

const getCustomer = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerById = async (req, res, next) => {
  const UserId = req.params.UserId;

  try {
    const customer = await Customer.findOne({ UserId: UserId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerByEmail = async (req, res, next) => {
  const email = req.params.email;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCustomer = async (req, res, next) => {
  const customerData = req.body;

  try {
    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();
    res.json({ customer: savedCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const addCustomer = async (req, res, next) => {
//     const customerData = req.body;

//     try {
//         // Here, you need to create a new instance of the Customer model
//         const customer = new Customer({
//             firstName: customerData.firstName,
//             lastName: customerData.lastName,
//             email: customerData.email,
//             contact: customerData.contact,
//             password: customerData.password,
//             // Ensure to include the privacyPolicy field
//             privacyPolicy: customerData.privacyPolicy
//         });

//         // Save the new customer to the database
//         const savedCustomer = await customer.save();
//         res.json({ customer: savedCustomer });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const updateCustomer = async (req, res, next) => {
  const UserId = req.params.UserId;
  const customerData = req.body;

  try {
    // if old password is provided, check if it matches the current password
    if (customerData.oldPassword && customerData.newPassword) {
      const customer = await Customer.findOne({
        UserId,
      });

      const passwordMatch = await bcrypt.compare(
        customerData.oldPassword,
        customer.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid old password",
        });
      }

      // hash the new password
      const hashedPassword = await bcrypt.hash(customerData.newPassword, 10);
      customerData.password = hashedPassword;
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { UserId: UserId },
      { $set: customerData },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};
//
const updateOrder = (req, res, next) => {
  const UserId = req.params.UserId;
  const { ProductsIds, Count, TotalPrice } = req.body;

  Orders.findOneAndUpdate(
    { UserId: UserId },
    {
      $set: { ProductsIds: ProductsIds, Count: Count, TotalPrice: TotalPrice },
    },
    { new: true }
  )
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error });
    });
};

const deleteCustomer = (req, res, next) => {
  const UserId = req.params.UserId; // Change to lowercase userId

  Customer.deleteOne({ UserId: UserId }) // Use lowercase userId
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message }); // Ensure to handle errors properly
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { UserId: customer.UserId, role: customer.role },
      process.env.JWT_SECRET,
      {
        // expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      user: {
        UserId: customer.UserId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        role: customer.role,
        profileUrl: customer.profileUrl,
      },
      token,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// customer registration
const register = async (req, res) => {
  const customerData = req.body;
  const { email, password } = customerData;

  try {
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = new Customer({
      ...customerData,
      password: hashedPassword,
    });

    const savedCustomer = await customer.save();
    res.json({ customer: savedCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login with google
const googleLogin = async (req, res) => {
  // console.log(token);

  // res.status(200).json({ message: "Google login" });

  try {
    const { token } = req.body;

    const authUser = await admin.auth().verifyIdToken(token);
    console.log(authUser);

    if (!authUser) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const customer = await Customer.findOne({ email: authUser.email });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const jwtToken = jwt.sign(
      { UserId: customer.UserId, role: customer.role },
      process.env.JWT_SECRET,
      {
        // expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      user: {
        UserId: customer.UserId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        role: customer.role,
        profileUrl: customer.profileUrl,
      },
      token: jwtToken,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ error: "Failed to login with Google" });
  }
};

// Login with facebook
const facebookLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const authUser = await admin.auth().verifyIdToken(token);
    console.log(authUser);

    if (!authUser) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const customer = await Customer.findOne({ email: authUser.email });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const jwtToken = jwt.sign(
      { UserId: customer.UserId, role: customer.role },
      process.env.JWT_SECRET,
      {
        // expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      user: {
        UserId: customer.UserId,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        role: customer.role,
        profileUrl: customer.profileUrl,
      },
      token: jwtToken,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Facebook login error:", error);
    res.status(401).json({ error: "Failed to login with Facebook" });
  }
};

// forgotPassword
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const customer = await Customer.findOne({
      email,
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    // send email with reset password link
    const emailTemplate = forgotPasswordEmailTemplate(
      customer.firstName,
      resetPasswordLink
    );
    sendEmail(customer.email, "Password Reset Requested", emailTemplate);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ error: "Error sending email" });
  }
};

// resetPassword
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Token expired",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }
    }

    const customer = await Customer.findById(decoded.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Customer.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getCustomer,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  login,
  getCustomerByEmail,
  register,
  googleLogin,
  facebookLogin,
  forgotPassword,
  resetPassword,
};
