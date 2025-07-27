import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyUserbyJWT } from "./../middlewares/auth.middleware.js";

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

//secured routes
router.route("/logout").post(verifyUserbyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changePassword").post(verifyUserbyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/update-avatar").patch(verifyUserbyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-cover-image").patch(verifyUserbyJWT, upload.single("coverImage"), updateUserCoverImage);

export default router;
