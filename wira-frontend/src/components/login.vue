<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="twoFACode" placeholder="2FA Code" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { login } from "@/api"; // Ensure this API function is implemented correctly

export default {
  data() {
    return {
      username: "",
      password: "",
      twoFACode: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      // Validate form fields
      if (!this.username || !this.password || !this.twoFACode) {
        this.errorMessage = "All fields are required.";
        return;
      }

      try {
        // Call login API
        const response = await login(this.username, this.password, this.twoFACode);
        localStorage.setItem("sessionId", response.sessionId); // Save session ID to localStorage
        this.$router.push("/ranking"); // Redirect to ranking page
      } catch (error) {
        // Handle login errors
        this.errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 14px;
}

button {
  padding: 10px;
  background-color: cornflowerblue;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background-color: royalblue;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
