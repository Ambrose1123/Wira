import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { query } from "../db.js"; // Import database query function

export async function login(req, res) {
  const { username, password, twoFACode } = req.body;

  try {
    // Step 1: Verify username
    const accountQuery = `
      SELECT * FROM account WHERE username = $1
    `;
    const result = await query(accountQuery, [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = result.rows[0];

    // Step 2: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.encrypted_password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Step 3: Validate 2FA (if enabled)
    if (user.secretkey_2fa) {
      const is2FAValid = speakeasy.totp.verify({
        secret: user.secretkey_2fa,
        encoding: "base32",
        token: twoFACode,
      });
      if (!is2FAValid) {
        return res.status(401).json({ error: "Invalid 2FA code" });
      }
    }

    // Step 4: Create a session
    const expiryDatetime = new Date(Date.now() + 3600000); // 1-hour session expiry
    const sessionQuery = `
      INSERT INTO session (session_metadata, expiry_datetime)
      VALUES ($1, $2)
      RETURNING session_id
    `;
    const sessionMetadata = JSON.stringify({
      acc_id: user.acc_id,
      username: user.username,
    });
    const sessionResult = await query(sessionQuery, [sessionMetadata, expiryDatetime]);
    const sessionId = sessionResult.rows[0].session_id;

    // Step 5: Respond with session ID
    res.json({ sessionId, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Logout function
export async function logout(req, res) {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    const deleteSessionQuery = `
      DELETE FROM session WHERE session_id = $1
    `;
    const result = await query(deleteSessionQuery, [sessionId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
