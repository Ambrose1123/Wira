<template>
  <div class="app">
    <header class="app-header">
      <h1>WIRA</h1>
      <span v-if="isLoggedIn" class="welcome-text">Welcome to WIRA!</span>
      <button v-if="isLoggedIn" @click="handleLogout" class="logout-button">Logout</button>
    </header>
    <main>
      <!-- Router View -->
      <router-view />
    </main>
  </div>
</template>

<script>
import { logout } from "@/api"; // Import logout function

export default {
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("sessionId"), // Check if user is logged in
    };
  },
  methods: {
    async handleLogout() {
      try {
        await logout(); // Call API to logout
        this.isLoggedIn = false; // Update state
        this.$router.push("/login"); // Redirect to login
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Error logging out. Please try again.");
      }
    },
  },
  watch: {
    // Watch for route changes and update isLoggedIn if needed
    $route() {
      this.isLoggedIn = !!localStorage.getItem("sessionId");
    },
  },
  mounted() {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      this.$router.push("/login"); // Redirect to login page
    }
  },
};
</script>

<style scoped>
/* General Styling */
.app {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative; /* Needed for the overlay */
  background: url('./images/background.jpg') no-repeat center center fixed;
  background-size: cover;
}
.app::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85); /* Black overlay with 50% opacity */
  z-index: 0; /* Place behind content */
}

.app > * {
  position: relative; /* Ensure content is above the overlay */
  z-index: 1;
}
/* Header Styling */
.app-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: url('./images/forest.png') no-repeat center center fixed;
  background-size: cover;
  color: white;
  width: 100vw;
  box-sizing: border-box;
}

/* Title Styling */
.app-header h1 {
  font-size: clamp(24px, 4vw, 36px); /* Responsive font size */
  margin: 0;
}

/* Welcome Text Styling */
.welcome-text {
  font-size: clamp(25px, 3vw, 40px); /* Responsive font size */
  margin: 0;
  text-align: center; /* Center-align text */
  flex: 1 100%; /* Full width on smaller screens */
}

/* Logout Button Styling */
.logout-button {
  margin-left: auto;
  padding: 10px 16px;
  background-color: white;
  color: cornflowerblue;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #3A5A9C;
  color: white;
}

/* Main Content Styling */
main {
  padding: 16px;
}

/* Small Screen Adjustments */
@media (max-width: 600px) {
  .app-header {
    flex-direction: column; /* Stack elements */
    text-align: center;
  }

  .logout-button {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
