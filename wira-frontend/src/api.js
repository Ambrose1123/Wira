const BASE_URL = "http://localhost:3000";

export async function fetchRankings(search = "", limit = 10, offset = 0, classId = "") {
  const classFilter = classId ? `&class_id=${classId}` : "";
  try {
    const response = await fetch(
      `${BASE_URL}/api/ranking?search=${search}&limit=${limit}&offset=${offset}${classFilter}`
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

// Fetch the maximum char_id to calculate total pages
export async function fetchMaxCharId() {
  try {
    const response = await fetch(`${BASE_URL}/api/max-char-id`);
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