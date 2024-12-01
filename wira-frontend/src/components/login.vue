<template>
  <div class="login-container">
    <h1>Login</h1>

    <!-- Step 1: Login Form -->
    <form v-if="!is2FARequired" @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>

    <!-- Step 2: 2FA Verification -->
    <div v-else>
      <form @submit.prevent="handle2FAVerification">
        <p>A 2FA code has been sent to your email. Please enter it below:</p>
        <input v-model="twoFACode" type="text" placeholder="2FA Code" required />
        <button type="submit">Verify 2FA</button>
      </form>
      <button @click="refreshPage" class="back-button">Back</button>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { login, verify2FA } from "@/api";

export default {
  data() {
    return {
      email: "",
      password: "",
      twoFACode: "",
      is2FARequired: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = ""; // Clear any previous errors
      if (!this.email || !this.password) {
        this.errorMessage = "Email and password are required.";
        return;
      }

      try {
        // Send login request
        const response = await login(this.email, this.password);
        console.log(response.message);
        // If login is successful, show the 2FA input
        this.is2FARequired = true;
      } catch (error) {
       // Display backend error message
      this.errorMessage = error.message; // Use the error message from the API function
      console.error("Login error:", error.message); // Log for debugging
      }
    },
    async handle2FAVerification() {
      this.errorMessage = ""; // Clear any previous errors
      if (!this.twoFACode) {
        this.errorMessage = "2FA code is required.";
        return;
      }

      try {
        // Send 2FA verification request
        const response = await verify2FA(this.email, this.twoFACode);
        console.log(response.message);
        // Store session ID and redirect to rankings
        localStorage.setItem("sessionId", response.sessionId);
        this.$router.push("/ranking");
      } catch (error) {
        // Display backend error message or fallback message
        this.errorMessage = error.response?.data?.error || "Invalid 2FA code.";
      }
    },
    refreshPage() {
      location.reload(); // Reload the page
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
.back-button {
  margin-top: 10px;
  padding: 15px 20px; /* Increase padding for larger size */
  font-size: 16px; /* Increase font size */
  background-color: gray;
  color: white;
  border: none;
  border-radius: 6px; /* Make it more rounded */
  cursor: pointer;
  display: inline-block;
  width: 100%; /* Optional: Make it span full width */
  text-align: center;
}

.back-button:hover {
  background-color: darkgray; /* Change hover color */
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
