import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  checkAuth
} from "./auth.controller.js"; // UPDATED PATH
import { verifyToken } from "../../middleware/verifyToken.js"; // UPDATED PATH

const router = express.Router();

router.get("/check-auth", verifyToken,checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-code", resendVerificationCode);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;