<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Username</label>
          <input v-model="username" id="username" type="text" placeholder="Enter username" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model="password" id="password" type="password" placeholder="Enter password" required />
        </div>
        <div>
          <label for="twoFACode">2FA Code</label>
          <input v-model="twoFACode" id="twoFACode" type="text" placeholder="Enter 2FA code" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import { login } from "@/api";
  
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
        try {
          const response = await login(this.username, this.password, this.twoFACode);
          localStorage.setItem("sessionId", response.sessionId); // Store sessionId for authentication
          this.$router.push("/ranking"); // Redirect to ranking page after successful login
        } catch (error) {
          this.errorMessage = "Login failed. Please check your credentials.";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: cornflowerblue;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .error {
    color: red;
    font-size: 14px;
  }
  </style>
  