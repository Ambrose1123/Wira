<template>
    <div>
      <h1>WIRA Ranking</h1>
  
      <!-- Filters: Search Input and Class Filter -->
      <div class="filter-container">
  <!-- Search Input and Button in one div -->
  <div class="search-group">
    <input
      type="text"
      v-model="searchTerm"
      @keyup.enter="redirectToSearch"
      placeholder="Search by username"
    />
    <button @click="redirectToSearch" class="search-icon-button">
      <i class="fas fa-search search-icon"></i>
    </button>
    </div>
        <!-- Select Dropdown in its own div -->
  <div class="select-group">
    <select v-model="selectedClass" @change="redirectToSearch">
      <option value="">All Classes</option>
      <option v-for="id in classIds" :key="id" :value="id">Class {{ id }}</option>
    </select>
  </div>
      </div>

   <!-- Loading State -->
   <div v-if="isLoading" class="loading">Loading...</div>
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
        <button v-if="errorMessage.includes('log in')" @click="redirectToLogin">
        Redirect to log in page
        </button>
        </div>
      <!-- Loading Mask -->
      <table v-if="isLoading" class="skeleton-table">
  <thead>
    <tr>
      <th>Rank</th>
      <th>Username</th>
      <th>Class</th>
      <th>Reward Score</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="n in 10" :key="n">
      <td><div class="skeleton-mask"></div></td>
      <td><div class="skeleton-mask"></div></td>
      <td><div class="skeleton-mask"></div></td>
      <td><div class="skeleton-mask"></div></td>
    </tr>
  </tbody>
</table>

<!-- Results Table -->
<table v-else>
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
      <div class="pagination-info" v-if="totalPages > 1">
        <!-- Page Display -->
      <div class="page-display">
        <p>Page: {{ currentPage }} / {{ totalPages }}</p>
      </div>

            <div class="pagination-controls">
            <!-- Previous Button -->
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"class="pagination-btn prev-next">Previous</button>
            
            <!-- Page Number Buttons -->
            <div class="page-numbers">
            <button v-for="page in visiblePages"
            :key="page"
            :class="['pagination-btn', { active: currentPage === page }]"
            @click="changePage(page)"
            >
            {{ page }}
            </button>
            </div>
         <!-- Next Button -->
        <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="pagination-btn prev-next"
        >
        Next
        </button>
        </div>
        <!-- Go to Specific Page -->
        <div class="goto-page">
        <input 
        type="number" 
        v-model.number="targetPage" 
        min="1" 
        :max="totalPages" 
         placeholder="Page"
        @keypress.enter="goToSpecificPage"
        />
        <button @click="goToSpecificPage" class="pagination-btn go-btn">Go</button>
        </div>
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
        errorMessage: "",
        targetPage: "", // To store the user input for a specific page
        currentPage: 1,
        totalPages: 80000,
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
      // Fetch default rankings without query parameters
      async fetchRankings() {
        console.log("fetchRankings is being called");
        const offset = (this.currentPage - 1) * this.limit;
        try {
        // Call the API function
        const data = await fetchRankings(this.searchTerm, this.limit, offset, this.selectedClass);
        // Extract results and total from the API response
        this.rankings = data.results; // Only the array of ranking data
        this.totalPages = Math.ceil(data.total / this.limit); // Calculate total pages
        }
        catch (error) {
          console.error("Error fetching rankings:", error);
          this.errorMessage = error.message;
        }
      },
      redirectToLogin() {
    localStorage.removeItem("sessionId"); // Clear any invalid session
    this.$router.push("/login"); // Redirect to login page
    },
      // Redirect to the same route with updated query parameters
      redirectToSearch() {
        this.$router.push({
          name: "SearchResults",
          query: {
            search: this.searchTerm,
            class_id: this.selectedClass,
            page: 1, // Reset to page 1 on new search or filter
          },
        });
      },
    changePage(newPage) {
      if (!newPage || newPage < 1 || newPage > this.totalPages) return;
      this.$router.push({
        name: "SearchResults",
        query: {
          search: this.searchTerm,
          class_id: this.selectedClass,
          page: newPage,
        },
      });
    },
    goToSpecificPage() {
      if (this.targetPage >= 1 && this.targetPage <= this.totalPages) {
        this.changePage(this.targetPage);
      } else {
        alert("Invalid page number.");
      }
    },
    },
    mounted() {
      console.log("Fetching default rankings...");
    // Fetch default rankings on page load
    this.fetchRankings();
    },
  };
  </script>
  <style scoped>
    .loading {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: whitesmoke;
  margin-top: 20px;
  margin-bottom:20px;
}
/* Skeleton Table Styles */
.skeleton-table {
  width: 80%;
  border-collapse: collapse;
  background-color: #2E2E2E;
}

.skeleton-table th,
.skeleton-table td {
  padding: 10px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.skeleton-mask {
  height: 16px;
  background: linear-gradient(90deg, #eeeeee, #dddddd, #eeeeee);
  background-size: 200% 100%;
  animation: loadingAnimation 1.5s infinite;
  border-radius: 4px;
}

/* Skeleton Animation */
@keyframes loadingAnimation {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* General styling */
.app {
  font-family: Arial, sans-serif;
  padding: 16px;
}
.error-message button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #3A5A9C;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 200px; /* Fixed width for the button */
  text-align: center; /* Center text */
  font-size: 16px; /* Larger text */
}

.error-message button:hover {
  background-color: royalblue;
}
h1 {
  font-size: clamp(24px, 3vw, 36px);
  text-align: center;
  margin-bottom: 16px;
  color: white; 
  padding: 16px;
}
.error-message {
  color: red;
  background-color: #ffe0e0;
  padding: 10px;
  border: 1px solid #ff6b6b;
  border-radius: 4px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}

/* Filter Section */
.filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
/* Group for Search Input and Button */
.search-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1; /* Allow it to grow */
}

input[type="text"] {
  flex: 1;
  padding: 8px;
  height: 40px;
  font-size: 14px;
  border: 1px solid black;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Select Group */
.select-group {
  width: 100%; /* Full width by default */
}

select {
  width: 100%; /* Full width for mobile */
  padding: 8px;
  font-size: 14px;
  height: 40px;
  border: 1px solid black;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Table styling */
.table-container {
  overflow-x: auto;
}
.search-icon-button {
  width: 40px; /* Fixed width to align with input height */
  height: 40px; /* Fixed height to match input/select */
  padding: 0; /* Remove internal padding to keep size uniform */
  background-color: #474747; /* Darker gray for the button */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.1s ease-in-out;
}

.search-icon-button:hover {
  background-color: #5a5a5a; /* Slightly lighter on hover */
  transform: scale(1.05); /* Slight zoom effect */
}

.search-icon {
  font-size: 16px; /* Consistent icon size */
}

table {
  width: 80%; /* Set table width to 80% */
  margin: 0 auto; /* Center the table horizontally */
  border-collapse: collapse;
  margin-bottom: 16px;
  background-color: #2E2E2E; /* Light dark grey */
  color: #E0E0E0; /* Light text for contrast */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8); /* Subtle shadow */

}

th {
  background-color: rgb(71, 9, 142);
  border: 1px solid lightgray;
  color: white;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase; /* Converts all text to uppercase */
  padding: clamp(8px, 2vw, 16px);
  font-size: clamp(12px, 2vw, 14px); 
  transition: background-color 0.3s ease-in-out, transform 0.1s ease-in-out; /* Smooth transition */
}

td {
  padding: clamp(8px, 2vw, 16px);
  border: 1px solid lightgray;
  text-align: center;
  font-size: clamp(12px, 2vw, 14px);
}
/* Target the first column (Rank) */
table th:first-child, table td:first-child {
  width: 50px; /* Set a specific width */
  min-width: 50px; /* Ensure it doesn't grow beyond this */
  text-align: center; /* Align text to the center */
}
table th:nth-child(3), table td:nth-child(3) {
  width: 50px; /* Set a specific width */
  min-width: 50px; /* Ensure it doesn't grow beyond this */
  text-align: center; /* Align text to the center */
}
thead th:hover {
  background-color: #7227B0; /* Slightly lighter navy blue */
  cursor: pointer;
}
tbody tr:hover {
  background-color: #4B3E57; 
  cursor: pointer;
}
/* Pagination Controls Styling */
.pagination-controls {
  display: flex;
  justify-content: space-between; /* Align "Previous" and "Next" to edges */
  align-items: center;
  gap: 10px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.page-display {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.page-numbers {
  display: flex;
  flex-wrap: wrap; /* Page numbers wrap neatly on small screens */
  justify-content: center;
  gap: 5px;
}

.pagination-btn {
  padding: 12px 20px;
  font-size: 14px;
  background-color: #0A0A5E; /* Navy blue */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.1s ease-in-out;
}

.pagination-btn:hover {
  background-color: #003366;
  transform: scale(1.05); /* Slight zoom effect */
}

.pagination-btn.active {
  background-color: #004080;
  color: white;
}
.pagination-btn:disabled {
  background-color: gray;
  cursor: not-allowed;
}
.pagination-btn.prev-next {
  min-width: 80px; /* Fixed size for Previous/Next */
}

.goto-page {
  margin-top: 10px;
  display: flex;
  gap: 5px;
  justify-content: center;
}

.goto-page input {
  width: 60px;
  padding: 6px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.goto-page button {
  background-color: #004080;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.goto-page button:hover {
  background-color: #003366;
  transform: scale(1.05);
}
/* Media Queries */
@media (max-width: 600px) {
  table {
    font-size: 12px;
    width: 100%;
  }
  .skeleton-table {
  width: 100%;
}
  .pagination-controls {
    flex-wrap: nowrap; /* Prevent wrapping */
    justify-content: space-between; /* Align Previous/Next to edges */
    gap: 4px; /* Smaller gap */
  }

  .page-numbers {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap; /* Keep page numbers in a row */
    gap: 4px;
  }

  .pagination-btn {
    padding: 6px 8px; /* Smaller buttons */
    font-size: 12px; /* Smaller font */
    min-width: 25px; /* Reduce button width */
  }

    .pagination-btn.prev-next {
    flex: 1; /* Allow Previous/Next to take available space evenly */
    font-size: 10px; /* Smaller font */
    min-width: 25px;
  }

  .goto-page {
    margin-top: 8px;
    justify-content: center;
  }

  .goto-page input {
    width: 50px; /* Smaller input */
    font-size: 12px;
    padding: 4px;
  }

  .goto-page button {
    font-size: 12px;
    padding: 4px 8px;
  }
}
/* Media Queries */
@media (min-width: 600px) {
  .filter-container {
    flex-wrap: nowrap; /* Prevent wrapping on larger screens */
  }

  .search-group {
    flex: initial; /* Stop growing */
  }

  .select-group {
    width: auto; /* Reset width */
  }
}
@media (min-width: 600px) and (max-width: 768px) {
  .filter-container {
    gap: 12px;
  }
  input,
  select {
    font-size: 14px;
  }
  table {
    font-size: 14px;
  }
  .pagination-controls {
    flex-wrap: nowrap; /* Prevent wrapping */
    align-items: center;
    gap: 10px;
  }

  .page-numbers {
    justify-content: center;
    gap: 4px;
  }

  .pagination-btn {
    font-size: 12px;
    padding: 6px 8px;
  }

  .goto-page input {
    width: 50px;
    font-size: 12px;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  .filter-container {
    flex-direction: row;
    gap: 16px;
  }
  table {
    font-size: 16px;
  }
  .pagination-controls button {
    font-size: 14px;
  }
}

@media (min-width: 992px) {
  table {
    font-size: 18px;
  }
}
</style>
