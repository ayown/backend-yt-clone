import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyUserbyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyUserbyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changePassword").post(verifyUserbyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyUserbyJWT, getCurrentUser);
router.route("/update-account").patch(verifyUserbyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyUserbyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover-image")
  .patch(verifyUserbyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/avatar").patch(verifyUserbyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyUserbyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyUserbyJWT, getUserChannelProfile);
router.route("/history").get(verifyUserbyJWT, getWatchHistory);

export default router;
