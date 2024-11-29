import express from "express";
import { getRankings, getMaxCharId } from "./controllers/rankingController.js"; // Import the new function

const router = express.Router();

// Route for rankings with search and pagination
router.get("/ranking", getRankings);

// Route for fetching max char_id
router.get("/max-char-id", getMaxCharId); // Add this line

export default router;
