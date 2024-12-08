import { query } from "../db.js";

export async function validateSession(req, res, next) {
  const sessionId = req.headers["sessionid"];
  // Input Validation: Check if sessionId is a valid integer
  if (!sessionId || isNaN(sessionId) || parseInt(sessionId) <= 0) {
    return res.status(400).json({ error: "Invalid session ID." }); //400 Bad Request: Invalid sessionid format.
  }

  try {
    const sessionQuery = `
      SELECT session_id, session_metadata, expiry_datetime FROM session WHERE session_id = $1
    `;
    const result = await query(sessionQuery, [sessionId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid or expired session, please log in again." });
    }

    const session = result.rows[0];
    
    if (new Date(session.expiry_datetime) < new Date()) {
      return res.status(401).json({ error: "Session expired, please log in again." });
    }
    console.log("Session validated for user");
    next(); // Proceed to protected route
  } catch (error) {
    console.error("Session validation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
