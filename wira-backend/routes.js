import express from "express";
import { getRankings } from "./controllers/rankingController.js";

const router = express.Router();

// Route for rankings with search and pagination
router.get("/ranking", getRankings);

export default router;
