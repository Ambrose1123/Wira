import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js"; // Import router

const app = createApp(App);
app.use(router); // Use the router instance
app.mount("#app");
