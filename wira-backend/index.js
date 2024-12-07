import express from "express";
import cors from "cors";
import router from "./routes.js"; // Import routes
import { query } from "./db.js"; // Import query function from db.js
import { sessionCleanup } from "./middlewares/sessionCleanupMiddleware.js";

const app = express();
const port = 3000;

app.use(cors({ origin: '*' })); // Allow all origins
app.use(express.json()); // Enable JSON parsing

setInterval(() => {
  sessionCleanup();
}, 10 * 60 * 1000); // 10 minutes in milliseconds

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
app.all("*", (req, res) => {
  console.log(`Unhandled request: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
