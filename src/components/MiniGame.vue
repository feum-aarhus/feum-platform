<template>
  <section class="game_frame">
    <div class="game_canvas">
      <!-- Here there will be the minigame, and the frame around it.
      Also the skip button if you choose not to play it -->
      <h1 class="game_hey-lg">Hey you</h1>
      <h1 class="game_hey-sm">There is a game</h1>
      <a
        class="game_play-button"
        href="https://feum-game.netlify.app/"
        target="blank"
        >Play a game!</a
      >
      <a class="game_play-button-phone" href="">Go to a laptop</a>
    </div>
  </section>
</template>

<script>
export default {
  name: "MiniGame"
};
</script>

<style lang="scss" scoped>
.game_frame {
  .game_canvas {
    width: 100%;
    height: 200px;
    background-color: #222;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    @include screen-is(lg) {
      height: 300px;
    }

    .game_hey-sm {
      font-family: "SourceCode-Bold", "sans-serif";
      color: $background;
      text-transform: uppercase;
      font-size: 20px;
      text-decoration: underline;

      @include screen-is(lg) {
        display: none;
      }
    }

    .game_hey-lg {
      display: none;

      @include screen-is(lg) {
        display: block;
        font-family: "SourceCode-Bold", "sans-serif";
        color: $background;
        text-transform: uppercase;
        font-size: 25px;
        text-decoration: underline;
      }
    }

    .game_play-button {
      display: none;

      @include screen-is(lg) {
        display: block;
        font-family: "SourceCode-Bold", "sans-serif";
        background-color: #be03fd;
        width: 20%;
        height: 35px;
        margin: 3rem auto;
        padding: 1.5rem;
        cursor: pointer;
        animation-name: pulsate;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        text-align: center;
        text-decoration: none;
      }
    }

    .game_play-button-phone {
      display: block;
      font-family: "SourceCode-Bold", "sans-serif";
      background-color: #be03fd;
      width: 20%;
      height: 35px;
      margin: 1.5rem auto;
      padding: 1.5rem;
      cursor: pointer;
      animation-name: pulsate;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      text-align: center;
      text-decoration: none;

      @include screen-is(lg) {
        display: none;
      }
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
</style>
