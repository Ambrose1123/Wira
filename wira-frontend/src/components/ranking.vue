<template>
    <div>
      <h1>WIRA Ranking</h1>
  
     <!-- Search and Class Filter -->
     <div class="filter-container">
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
    </div>
  
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
      <div class="pagination-info">
      <!-- Display Current Page and Total Pages -->
      <p>Page: {{ currentPage }} / {{ totalPages }}</p>
      <div class="pagination-controls">
        <button @click="goToPreviousPage" :disabled="currentPage === 1">Previous</button>
        <!-- Numbered Pagination -->
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button @click="goToNextPage" :disabled="currentPage === totalPages">Next</button>
        <input
        type="number"
        v-model.number="targetPage"
        @keypress.enter="goToSpecificPage"
        placeholder="Page"
        min="1"
        :max="totalPages"
      />
      <button @click="goToSpecificPage">Go</button>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  import { fetchRankings } from "@/api"; // Import the API function
  import { fetchMaxCharId } from "@/api"; // Import the API function
  
  export default {
    data() {
      return {
        rankings: [],
        searchTerm: "",
        selectedClass: "",
        targetPage: "", // To store the user input for a specific page
        currentPage: 1,
        totalPages: 80,
        visiblePages: [], // Pages to display in numbered pagination
        limit: 10,
        classIds: [1, 2, 3, 4, 5, 6, 7, 8],
      };
    },
    computed: {
      visiblePages() {
        const maxVisible = 7; // Maximum visible page numbers
        const pages = [];
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
  
        if (endPage - startPage < maxVisible - 1) {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }
  
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
  
        return pages;
      },
    },
    methods: {
      async fetchMaxCharId() {
        console.log("fetchMaxCharId is being called");
        try {
          const maxCharId = await fetchMaxCharId(); // Call the API
      console.log("Max Char ID:", maxCharId); // Debugging log
      this.totalPages = Math.ceil(maxCharId / this.limit); // Calculate total pages
      console.log("Total Pages:", this.totalPages); // Debugging log
        } catch (error) {
          console.error("Failed to fetch maxCharId:", error);
        }
      },
      async fetchRankings() {
        console.log("fetchRankings is being called");
        const offset = (this.currentPage - 1) * this.limit;
        try {
          // Use the API function
          this.rankings = await fetchRankings(this.searchTerm, this.limit, offset, this.selectedClass);
        } catch (error) {
          console.error("Error fetching rankings:", error);
        }
      },
      goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.fetchRankings(); // Add your fetch logic here
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
      goToSpecificPage() {
        if (this.targetPage >= 1 && this.targetPage <= this.totalPages) {
          this.currentPage = this.targetPage;
          this.fetchRankings();
        } else {
          alert("Invalid page number.");
        }
      },
    },
    mounted() {
      console.log("ranking.vue mounted");
      this.fetchMaxCharId(); // Fetch maxCharId on load
      this.fetchRankings();
    },
  };
  </script>
  <style scoped>
  /* General styling */
  .app {
    font-family: Arial, sans-serif;
    padding: 16px;
  }
  
  h1 {
    font-size: clamp(24px, 3vw, 36px); /* Responsive heading size */
    text-align: center;
    margin-bottom: 16px;
  }
  
  /* Filter Section */
  .filter-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
  }
  
  select {
    width: clamp(150px, 50%, 300px); /* Dynamic resizing based on screen size */
    padding: clamp(8px, 1vw, 12px);
    font-size: clamp(12px, 1.5vw, 16px);
    border: 1px solid lightgray;
    border-radius: 4px;
    background-color: white;
    color: black;
  }
  
  input[type="text"] {
    width: clamp(200px, 50%, 400px); /* Adjust input size */
    padding: clamp(8px, 1.5vw, 12px);
    font-size: clamp(14px, 2vw, 16px);
    border: 1px solid lightgray;
    border-radius: 4px;
  }
  
  /* Table styling */
  .table-container {
    overflow-x: auto; /* Scrollable on smaller screens */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
  }
  
  th {
    background-color: cornflowerblue; /* Blue header */
    color: white; /* White text for contrast */
    font-weight: bold;
    padding: clamp(8px, 2vw, 16px);
    font-size: clamp(12px, 2vw, 14px);
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
  
  td {
    padding: clamp(8px, 2vw, 16px);
    border: 1px solid lightgray;
    text-align: left;
    font-size: clamp(12px, 2vw, 14px);
  }
  
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  }
  
  button {
    padding: clamp(8px, 1.5vw, 12px);
    font-size: clamp(12px, 2vw, 16px);
    background-color: cornflowerblue;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: clamp(40px, 8vw, 80px); /* Responsive width for numbered buttons */
  }
  
  button:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    /* Mobile-specific adjustments */
    th,
    td {
      font-size: clamp(10px, 2vw, 12px);
    }
  
    button {
      width: 100px; /* Ensure smaller button size */
    }
  }
  </style>
  