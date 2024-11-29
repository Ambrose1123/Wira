<template>
  <div id="app">
    <header>
      <h1>WIRA Dashboard</h1>
    </header>
    <main>
      <!-- Router View for dynamic content -->
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* General Styles */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

header {
  background-color: cornflowerblue;
  color: white;
  text-align: center;
  padding: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

main {
  padding: 20px;
}
</style>
