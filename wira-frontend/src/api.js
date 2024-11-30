const BASE_URL = "http://localhost:3000";

// Updated fetchRankings with sessionId header
export async function fetchRankings(search = "", limit = 10, offset = 0, classId = "") {
  const classFilter = classId ? `&class_id=${classId}` : "";
  const sessionId = localStorage.getItem("sessionId"); // Retrieve sessionId
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
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Updated fetchMaxCharId with sessionId header
export async function fetchMaxCharId() {
  const sessionId = localStorage.getItem("sessionId"); // Retrieve sessionId
  try {
    const response = await fetch(`${BASE_URL}/api/max-char-id`, {
      headers: {
        sessionId, // Add sessionId to headers
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.maxCharId; // Return the maxCharId value
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}


export async function login(username, password, twoFACode) {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, twoFACode }),
  });

  if (!response.ok) {
    throw new Error(await response.json());
  }

  return await response.json();
}

export async function logout() {
  const sessionId = localStorage.getItem("sessionId");

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
