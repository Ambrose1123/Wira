import { query } from "../db.js";

export const getRankings = async (req, res) => {
    try {
      const { search = "", limit = 10, offset = 0, class_id } = req.query;
  
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
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };
  