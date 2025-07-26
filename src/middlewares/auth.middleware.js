import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyUserbyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Check if the token is present in cookies or headers
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token is found, return an error
    if (!token) {
      return new ApiError(401, "Unauthorized access").send(res);
    }

    // Verify/Decode the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // find the user by ID from the decoded token
    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return new ApiError(404, "User not found").send(res);
    }
    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    return new ApiError(500, error?.message || "Internal server error");
  }
});
