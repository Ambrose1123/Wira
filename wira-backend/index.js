import express from "express";
import cors from "cors";
import router from "./routes.js"; // Import routes
import { query } from "./db.js"; // Import query function from db.js
import redis from "redis"; // Import Redis client

const app = express();
const port = 3000;

// Initialize Redis client
const redisClient = redis.createClient({
  url: "redis://localhost:6379", // Redis server URL
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Ensure Redis connects before starting the server
redisClient.connect()
  .then(() => {
    console.log("Connected to Redis");

app.use(cors());

// ensuring the host is working fine with displaying hello world
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use the modularized routes for rankings
app.use("/api", router);

//testing if database connection is working
app.get("/test-db", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
})


.catch((err) => {
  console.error("Could not connect to Redis:", err);
  process.exit(1); // Exit if Redis is not available
});

export default redisClient; // Export Redis client for use in other files
