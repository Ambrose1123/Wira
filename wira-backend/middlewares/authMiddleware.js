import { query } from "../db.js";

export async function validateSession(req, res, next) {
  const sessionId = req.headers["sessionid"];
  if (!sessionId) {
    return res.status(401).json({ error: "Session ID is required" });
  }

  try {
    const sessionQuery = `
      SELECT session_id, expiry_datetime FROM session WHERE session_id = $1
    `;
    const result = await query(sessionQuery, [sessionId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    const session = result.rows[0];
    
    if (new Date(session.expiry_datetime) < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    console.log("Session validated, proceeding...");
    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Session validation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
