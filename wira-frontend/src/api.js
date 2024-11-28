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
