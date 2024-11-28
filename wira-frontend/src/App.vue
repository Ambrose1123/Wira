<template>
  <div>
    <h1>WIRA Leaderboard</h1>

    <!-- Search Input -->
    <input
      type="text"
      v-model="searchTerm"
      @input="fetchRankings"
      placeholder="Search by username"
    />

    <!-- Class Filter -->
    <select v-model="selectedClass" @change="fetchRankings">
      <option value="">All Classes</option>
      <option v-for="id in classIds" :key="id" :value="id">Class {{ id }}</option>
    </select>

    <!-- Rankings Table -->
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Class</th>
          <th>Reward Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ranking, index) in rankings" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * limit }}</td>
          <td>{{ ranking.username }}</td>
          <td>{{ ranking.class_id }}</td>
          <td>{{ ranking.reward_score }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div>
      <button @click="goToPreviousPage" :disabled="currentPage === 1">Previous</button>
      <button @click="goToNextPage">Next</button>
    </div>
  </div>
</template>

<script>
import { fetchRankings } from "@/api"; // Import the API function

export default {
  data() {
    return {
      rankings: [],
      searchTerm: "",
      selectedClass: "",
      currentPage: 1,
      limit: 10,
      classIds: [1, 2, 3, 4, 5, 6, 7, 8],
    };
  },
  methods: {
    async fetchRankings() {
      const offset = (this.currentPage - 1) * this.limit;
      try {
        // Use the API function
        this.rankings = await fetchRankings(this.searchTerm, this.limit, offset, this.selectedClass);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    },
    goToNextPage() {
      this.currentPage++;
      this.fetchRankings();
    },
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchRankings();
      }
    },
  },
  mounted() {
    this.fetchRankings();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  text-align: left;
}

th,
td {
  border: 1px solid lightgray; /* Light gray border for all cells */
  padding: 10px;
}

th {
  background-color: cornflowerblue; /* Blue header */
  color: white; /* White text for contrast */
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: aliceblue; /* Subtle blue for even rows */
}

tr:nth-child(odd) {
  background-color: white; /* White for odd rows */
}

tr:hover {
  background-color: lightsteelblue; /* Light blue-gray on hover */
}
</style>
