import { query } from "../db.js";
import NodeCache from "node-cache"; //Import node-cache

const cache = new NodeCache({ stdTTL: 3600 }); // Cache expires in 1 hour

export const getRankings = async (req, res) => {
    try {
      const { search = "", limit = 10, offset = 0, class_id } = req.query;

      // Generate a unique cache key based on query parameters
      const cacheKey = `rankings:${search}:${limit}:${offset}:${class_id || "all"}`;

      // Check if the data is already cached in Redis
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
      console.log("Serving data from cache");
      return res.json(cachedData); // Serve cached data
      }
      // Build the base query(show username all class id and reward score)
      let baseQuery = `
        SELECT account.username, character.class_id, scores.reward_score
        FROM scores
        JOIN character ON scores.char_id = character.char_id
        JOIN account ON character.acc_id = account.acc_id
        WHERE account.username ILIKE $1
      `;
  
      const queryParams = [`%${search}%`];
  
      // Add filtering by class_id if provided
      if (class_id) {
        baseQuery += " AND character.class_id = $2";
        queryParams.push(class_id);
      }
  
      // Add sorting, pagination, and final query structure
      baseQuery += `
        ORDER BY scores.reward_score DESC, character.char_id ASC
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `;
      queryParams.push(limit, offset);
  
      const result = await query(baseQuery, queryParams);

      // Save data to cache
      cache.set(cacheKey, result.rows);

  
    console.log("Serving data from database");  
    res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };
  
  export const getMaxCharId = async (req, res) => {
    try {
      // Query to fetch the maximum char_id
      const maxCharIdQuery = `
        SELECT MAX(char_id) AS max_char_id FROM character;
      `;
      const maxCharIdResult = await query(maxCharIdQuery);
  
      const maxCharId = maxCharIdResult.rows[0]?.max_char_id || 0; // Default to 0 if no data
      res.json({ maxCharId }); // Return the result
    } catch (error) {
      console.error("Error fetching max char_id:", error);
      res.status(500).json({ success: false, error: "Failed to fetch max char_id" });
    }
  };
