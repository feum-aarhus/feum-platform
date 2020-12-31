<template>
  <section class="game_frame">
    <!-- Here there will be the minigame, and the frame around it.
    Also the skip button if you choose not to play it -->
    <!-- <h1 class="game_hey-lg">Hey you</h1>
    <h1 class="game_hey-sm">There is a game</h1> -->
    <a
      class="game_play-button"
      href="https://feum-game.netlify.app/"
      target="blank"
      ><img src="@/assets/snake.png" alt=""
    /></a>
  </section>
</template>

<script>
export default {
  name: "MiniGame"
};
</script>

<style lang="scss" scoped>
.game_frame {
  .game_play-button {
    display: none;

    @include screen-is(lg) {
      display: block;
      font-family: "SourceCode-Bold", "sans-serif";
      // background-color: $red;
      width: 8%;
      height: auto;
      padding: 1.5rem 1rem;
      cursor: pointer;
      animation-name: playGame;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      text-align: center;
      text-decoration: none;
      position: fixed;
      top: 50%;
      right: 3rem;
    }
  }
}
@keyframes pulsate {
  0% {
    background-color: #be03fd;
  }
  25% {
    background-color: #dfff11;
  }
  50% {
    background-color: #be03fd;
  }
  75% {
    background-color: #0ff0fc;
  }
  100% {
    background-color: #be03fd;
  }
}
@keyframes playGame {
  0% {
    right: 3rem;
  }
  25% {
    right: 3.5rem;
  }
  50% {
    right: 3rem;
  }
  75% {
    right: 3.5rem;
  }
  100% {
    right: 3rem;
  }
}
</style>
