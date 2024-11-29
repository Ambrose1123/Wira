import express from "express";
import { getRankings, getMaxCharId } from "./controllers/rankingController.js"; // Import the new function
import { login,logout } from "./controllers/authController.js";

const router = express.Router();

// Route for rankings with search and pagination
router.get("/ranking", getRankings);

// Route for fetching max char_id
router.get("/max-char-id", getMaxCharId); // Add this line

router.post("/login", login);
// Route for logout
router.post("/logout", logout);
export default router;
