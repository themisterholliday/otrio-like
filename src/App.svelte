<script lang="ts">
  import FullGameBoard from './lib/components/FullGameBoard.svelte';
</script>

<main>
  <!-- App -->
  <FullGameBoard />
</main>

<style>
  main {
    height: 100%;
  }

  .stack_item_container {
    height: 20%;
  }

  .stack_item_container_column {
    height: 60%;
    width: 20%;
    margin: 0 auto;
  }
</style>
