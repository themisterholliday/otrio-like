<script lang="ts">
  import {get_game_state_manager} from '../game/game_state';
  import Board from './Board.svelte';
  import StackItemSetGroup from './StackItemSetGroup.svelte';

  function handle_state_change() {
    game_state = game_state_manager.game_state;
    set_1 = game_state_manager.get_stack_items_for_set(0);
  }

  let game_state_manager = get_game_state_manager(handle_state_change);

  function reset() {
    game_state_manager = get_game_state_manager(handle_state_change);
  }

  $: game_state = game_state_manager.game_state;
  $: set_1 = game_state_manager.get_stack_items_for_set(0);

  let count = 0;
</script>

<div class="full_board">
  <!-- Board -->
  <button on:click={reset}>Reset</button>
  <div class="stack_item_container">
    <StackItemSetGroup stack_items={set_1} />
  </div>
  <Board
    stack_items={game_state.stack_items}
    on:stack_item_click={event => {
      game_state_manager.update_stack_item_location(count, event.detail);
      count += 1;
    }}
  />
</div>

<style>
  .full_board {
    height: 100%;
  }

  .stack_item_container {
    height: 20%;
  }
</style>
