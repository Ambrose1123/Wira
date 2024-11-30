import { query } from "../db.js"; // Import the query function

export const sessionCleanup = async () => {
  try {
    // Query to delete expired sessions
    const cleanupQuery = `
      DELETE FROM session WHERE expiry_datetime < NOW()
    `;
    const result = await query(cleanupQuery);
    console.log(`Session cleanup executed. Rows deleted: ${result.rowCount}`);
  } catch (error) {
    console.error("Error during session cleanup:", error);
  }
};
