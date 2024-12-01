import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import nodemailer from "nodemailer";
import { query } from "../db.js"; // Import database query function

// Email transport configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "likai.phong@gmail.com", // Your email
    pass: "irxt tdvb ymav isqa", // Your app password
  },
});

// Helper function to send 2FA email
async function send2FAEmail(email, twoFACode) {
  const mailOptions = {
    from: "ambrosetest1123@gmail.com", // Your email
    to: email,
    subject: "Your 2FA Code",
    text: `Your 2FA code is: ${twoFACode}. It is valid for 1 minute.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`2FA code sent to: ${email}`);
}

// Login function
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Step 1: Verify email
    const accountQuery = `SELECT * FROM account WHERE email = $1`;
    const result = await query(accountQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }
    const user = result.rows[0];

    // Step 2: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.encrypted_password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Step 3: Generate and send 2FA code
    const twoFACode = speakeasy.totp({
      secret: user.secretkey_2fa,
      encoding: "base32",
      step: 90,
    });

    await send2FAEmail(user.email, twoFACode);
    res.json({ message: "2FA code sent. Please check your email." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 2FA verification function
export async function verify2FA(req, res) {
  console.log("Request received at /verify-2fa", req.body);

  const { email, twoFACode } = req.body;

  if (!email || !twoFACode) {
    console.log("Missing email or 2FA code");
    return res.status(400).json({ error: "Email and 2FA code are required" });
  }

  try {
    const accountQuery = `SELECT * FROM account WHERE email = $1`;
    console.log("Querying database with email:", email);
    const result = await query(accountQuery, [email]);

    if (result.rows.length === 0) {
      console.log("Email not found in database");
      return res.status(404).json({ error: "Invalid email or 2FA code" });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    const is2FAValid = speakeasy.totp.verify({
      secret: user.secretkey_2fa,
      encoding: "base32",
      token: twoFACode,
      step: 90,
    });

    if (!is2FAValid) {
      console.log("Invalid 2FA code");
      return res.status(401).json({ error: "Invalid 2FA code" });
    }

    console.log("2FA verified successfully");

    const expiryDatetime = new Date(Date.now() + 3600000);
    const sessionQuery = `INSERT INTO session (session_metadata, expiry_datetime) VALUES ($1, $2) RETURNING session_id`;
    const sessionMetadata = JSON.stringify({ acc_id: user.acc_id, email: user.email });
    const sessionResult = await query(sessionQuery, [sessionMetadata, expiryDatetime]);
    const sessionId = sessionResult.rows[0].session_id;

    res.json({ sessionId, message: "2FA verification successful" });
  } catch (error) {
    console.error("Error during 2FA verification:", error);
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
    const deleteSessionQuery = `DELETE FROM session WHERE session_id = $1`;
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
