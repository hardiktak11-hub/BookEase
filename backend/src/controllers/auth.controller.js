import User from "../models/user.model.js";
import VendorProfile from "../models/vendorprofile.model.js";
import validateEmail from "../utils/validateEmail_temp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// CUSTOMER REGISTRATION
export const registerCustomer = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Required field validation
    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already registered"
      });
    }

    // Create customer
    const user = await User.create({
      username,
      email,
      phone,
      password,
      role: "customer"
    });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// VENDOR REGISTRATION
export const registerVendor = async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      password,
      businessName,
      description,
      serviceCategories,
      experience,
      address
    } = req.body;

    // Required field validation
    if (
      !username ||
      !email ||
      !phone ||
      !password ||
      !businessName
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already registered"
      });
    }

    // Create vendor user
    const user = await User.create({
      username,
      email,
      phone,
      password,
      role: "vendor"
    });

    try {
      // Create vendor profile
      const vendorProfile = await VendorProfile.create({
        userId: user._id,
        businessName,
        description,
        serviceCategories,
        experience,
        address,
        status: "pending"
      });

      return res.status(201).json({
        success: true,
        message: "Vendor registered successfully. Awaiting admin approval.",
        vendor: {
          userId: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          businessName: vendorProfile.businessName,
          status: vendorProfile.status
        }
      });

    } catch (profileError) {
      // Rollback user creation if profile creation fails
      await User.findByIdAndDelete(user._id);
      throw profileError;
    }

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email, phone or vendor profile already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find if user exist in db or not
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    
    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    };

    // Send tokens through cookies
    return res
      .status(200)
      .cookie("accessToken", accessToken,cookieOptions)
      .cookie("refreshToken",refreshToken,cookieOptions)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// REFRESH ACCESS TOKEN
export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    // Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user and retrieve stored refresh token
    const user = await User.findById(decodedToken._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token"
      });
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Replace old refresh token with new one
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken,cookieOptions)
      .cookie("refreshToken",newRefreshToken,cookieOptions)
      .json({
        success: true,
        message: "Access token refreshed successfully"
      });

  } catch (error) {
    console.error("Refresh token error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};

// LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
      // Remove the stored refresh token
      await User.findOneAndUpdate(
        { refreshToken: incomingRefreshToken },
        { $set: { refreshToken: null } }
      );
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({
        success: true,
        message: "Logged out successfully"
      });

  } catch (error) {
    console.error("Logout error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
