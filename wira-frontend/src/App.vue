<script setup>

</script>
//making a rough layout for LEADERBOARD
<template>
  <header>
    <div class="center-box">
      <h1>
        LEADERBOARD
      </h1>
      <div v-for="(item, index) in movie" :key="index">
        <p>
          ID: {{ item.id }}
        </p>
        <p>
          Ranking: {{ item.ranking }}
        </p>
        <p>
          Score: {{ item.score }}
        </p>
      </div>
    </div>
  </header>
  <main>
  </main>
</template>

<script lang="js">
import { ref } from 'vue'

export default {

  data() {
    return {
      movie: 0,
    }
  },

  mounted() {
    fetch('http://localhost:3000/ranking')
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        this.movie = json
      });
  }
}

</script>

<style scoped>
.center-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
