<script lang="ts">
  import FullGameBoard from './lib/components/FullGameBoard.svelte';
</script>

<main>
  <!-- App -->
  <span class="container">
    <FullGameBoard />
  </span>
</main>

<style>
  main {
    height: 100%;
  }

  .container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
