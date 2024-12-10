import express from "express";
import { login, verify2FA, logout } from "./controllers/authController.js";
import { getRankings, getMaxCharId } from "./controllers/rankingController.js";
import { validateSession } from "./middlewares/authMiddleware.js";

const router = express.Router();

// Login endpoint
router.post("/login", login);
// Logout endpoint
router.post("/logout", logout);

// Route for rankings (protected)
router.get("/ranking", validateSession, getRankings);

router.post("/verify-2fa", verify2FA);
// Route for fetching max char_id (protected)
// router.get("/max-char-id", validateSession, getMaxCharId);

export default router;
