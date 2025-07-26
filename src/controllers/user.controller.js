import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ refreshToken: true }); //or await user.save({ validateBeforeSave: false }); (lecture mei 2nd one dikhaya gya hai)

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // the res is coming from the frontend

  // Extract user data from request body
  const { username, email, fullName, password } = req.body;
  console.log("email: ", email);

  // Validate required fields
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  await User.findOne({
    $or: [{ email }, { username }], //dono mei se koi bhi match ho to
  }).then((existingUser) => {
    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists"
      );
    }
  });

  // Files uploaded on local storage and got their paths which are stored in req.files
  const avatarLocalPath = req.files.avatar[0]?.path;

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files?.coverImage &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Files uploaded on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  // New entry in the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  // Check if user creation was successful and also remove password and refreshToken from the response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Extract user data from request body
  const { email, username, password } = req.body;

  // Validate required fields
  if (!username && !email) {
    throw new ApiError(400, "Email & username is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")
  // }

  // Check if user exists
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log(user);
  if (!user) throw new ApiError(404, "User does not exist");

  // Check if password is correct
  const isPassValid = await user.isPasswordCorrect(password);
  if (!isPassValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Remove password and refreshToken from the response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //Cookies
  const cookieOptions = {
    httpOnly: true,
    secure: true || process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user._id;

  // Find the user and clear the refresh token
  await User.findByIdAndUpdate(
    user,
    {
      $set: { refreshToken: "" },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true || process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
