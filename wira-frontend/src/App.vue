<template>
  <div>
    <header>
      <h1>WIRA</h1>
      <span v-if="isLoggedIn">Welcome to WIRA ranking!</span>
      <button v-if="isLoggedIn" @click="handleLogout">Logout</button>
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
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: cornflowerblue;
  color: white;
}

button {
  padding: 8px 12px;
  background-color: white;
  color: cornflowerblue;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: lightblue;
}

main {
  padding: 16px;
}
</style>
