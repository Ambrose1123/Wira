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
  background: url('./images/background.jpg') no-repeat center center fixed;
  background-size: cover;
}
/* Header Styling */
.app-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: cornflowerblue;
  color: white;
  width: 97.5vw;
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
  background-color: lightblue;
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
