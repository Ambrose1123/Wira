const BASE_URL = "http://3.25.163.158:3000";

// Helper function to get sessionId as an integer
function getSessionId() {
  const sessionId = localStorage.getItem("sessionId");
  return sessionId ? parseInt(sessionId, 10) : null; // Convert to integer
}

// Updated fetchRankings with sessionId header
export async function fetchRankings(search = "", limit = 10, offset = 0, classId = "") {
  const classFilter = classId ? `&class_id=${classId}` : "";
  const sessionId = getSessionId();// Retrieve sessionId
  if (!sessionId) throw new Error("No session ID found. Please log in again.");

  try {
    const response = await fetch(
      `${BASE_URL}/api/ranking?search=${search}&limit=${limit}&offset=${offset}${classFilter}`,
      {
        headers: {
          sessionId, // Add sessionId to headers
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json(); // Parse backend error response
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Updated fetchMaxCharId with sessionId header
//Not needed anymore
/* export async function fetchMaxCharId() { 
  const sessionId = getSessionId(); // Retrieve sessionId
  try {
    const response = await fetch(`${BASE_URL}/api/max-char-id`, {
      headers: {
        sessionId, // Add sessionId to headers
      },
    });
    if (!response.ok) {
      const errorData = await response.json(); // Parse backend error response
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.maxCharId; // Return the maxCharId value
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
*/

export async function login(identifier, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

// Verify 2FA function
export async function verify2FA(email, twoFACode) {
  try {
    const response = await fetch(`${BASE_URL}/api/verify-2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, twoFACode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "2FA verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("2FA verification failed:", error);
    throw error;
  }
}
export async function logout() {
  const sessionId = getSessionId();

  if (!sessionId) {
    console.error("No session ID found in localStorage.");
    throw new Error("No session ID found. Please log in again.");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }), // Send sessionId in the body
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Logout failed with error:", errorResponse);
      throw new Error(errorResponse.error || "Logout failed");
    }

    // Clear session data on successful logout
    localStorage.removeItem("sessionId");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
