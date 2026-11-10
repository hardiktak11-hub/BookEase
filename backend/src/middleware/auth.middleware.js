import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    // If token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Access token missing"
      });
    }

    // Verify JWT and decode payload
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Find user and exclude sensitive information
    const loggedInUser = await User.findById(decodedToken._id)
      .select("-password -refreshToken");

    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token"
      });
    }

    // Attach authenticated user to request
    req.user = loggedInUser;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token"
    });
  }
};
