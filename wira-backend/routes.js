import express from "express";
import { getRankings, getMaxCharId } from "./controllers/rankingController.js"; // Import the new function
import { login,logout } from "./controllers/authController.js";
import { validateSession } from "./middlewares/authMiddleware.js"; // Import middleware

const router = express.Router();

// Route for rankings with search and pagination
router.get("/ranking", validateSession,getRankings);

// Route for fetching max char_id
router.get("/max-char-id", validateSession,getMaxCharId); // Add this line

router.post("/login", login);
// Route for logout
router.post("/logout", logout);
export default router;
