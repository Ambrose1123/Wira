import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js"; // Import router
import './assets/main.css'; // Import global CSS file
import "@fortawesome/fontawesome-free/css/all.css";

const app = createApp(App);
app.use(router); // Use the router instance
app.mount("#app");
