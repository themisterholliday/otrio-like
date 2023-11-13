<script lang="ts">
  import {
    get_color_for_set,
    get_game_state_manager,
    type StackItemAndIndex,
  } from '../game/game_state';
  import Board from './Board.svelte';
  import StackItemSetGroup from './StackItemSetGroup.svelte';
  import Winner from './Winner.svelte';

  function handle_state_change() {
    game_state = game_state_manager.game_state;
    set_0 = game_state_manager.get_stack_items_for_set(0);
    set_1 = game_state_manager.get_stack_items_for_set(1);
    set_2 = game_state_manager.get_stack_items_for_set(2);
    set_3 = game_state_manager.get_stack_items_for_set(3);
  }

  let game_state_manager = get_game_state_manager(handle_state_change);

  function reset() {
    game_state_manager = get_game_state_manager(handle_state_change);
    selected_item = undefined;
  }

  function handle_set_selected_item(event: CustomEvent<StackItemAndIndex>) {
    selected_item = event.detail;
  }

  function handle_board_seleceted_stack_item(
    event: CustomEvent<[number, number]>
  ) {
    if (selected_item !== undefined) {
      const success = game_state_manager.update_stack_item_location(
        selected_item.index,
        event.detail
      );
      if (success === true) {
        selected_item = undefined;
      }
    }
  }

  let selected_item: StackItemAndIndex | undefined = undefined;
  $: game_state = game_state_manager.game_state;
  $: set_0 = game_state_manager.get_stack_items_for_set(0);
  $: set_1 = game_state_manager.get_stack_items_for_set(1);
  $: set_2 = game_state_manager.get_stack_items_for_set(2);
  $: set_3 = game_state_manager.get_stack_items_for_set(3);
  $: winner = game_state.winner;
</script>

<button class="reset_button" on:click={reset}>Reset</button>
{#if winner !== undefined}
  <Winner />
{/if}
<div class="full_board">
  <div class="stack_item_container_0">
    <StackItemSetGroup
      stack_items={set_0}
      color={get_color_for_set(0)}
      highlighted={game_state.active_set === 0}
      on:selected_item={handle_set_selected_item}
    />
  </div>

  <div class="stack_item_container_1">
    <StackItemSetGroup
      stack_items={set_1}
      direction={'column'}
      color={get_color_for_set(1)}
      highlighted={game_state.active_set === 1}
      on:selected_item={handle_set_selected_item}
    />
  </div>

  <div class="board">
    <Board
      stack_items={game_state.stack_items}
      on:stack_item_click={handle_board_seleceted_stack_item}
    />
  </div>

  <div class="stack_item_container_2">
    <StackItemSetGroup
      stack_items={set_2}
      color={get_color_for_set(2)}
      highlighted={game_state.active_set === 2}
      on:selected_item={handle_set_selected_item}
    />
  </div>

  <div class="stack_item_container_3">
    <StackItemSetGroup
      stack_items={set_3}
      direction={'column'}
      color={get_color_for_set(3)}
      highlighted={game_state.active_set === 3}
      on:selected_item={handle_set_selected_item}
    />
  </div>
</div>

<style>
  .full_board {
    height: 100%;
    display: grid;

    grid-template-areas:
      '. header .'
      'nav content side'
      '. footer .';

    --grid-gap: 0.25rem;
    --colum_size: calc(
      calc(var(--stack_item_size) * 3) + calc(var(--grid-gap) * 2) + 3rem
    );

    grid-template-columns: 1fr var(--colum_size) 1fr;
    grid-template-rows: 1fr var(--colum_size) 1fr;
    grid-gap: var(--grid-gap);

    width: 100%;
    max-width: calc(
      calc(calc(var(--stack_item_size) * 2) + var(--colum_size)) + 4rem
    );
    max-height: calc(
      calc(calc(var(--stack_item_size) * 2) + var(--colum_size)) + 4rem
    );

    background-color: #fffcf0;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5);

    border-radius: 2rem;
  }

  .board {
    grid-area: content;
    aspect-ratio: 1 / 1;
  }

  .stack_item_container_0 {
    grid-area: header;
  }

  .stack_item_container_1 {
    grid-area: side;
  }

  .stack_item_container_2 {
    grid-area: footer;
  }

  .stack_item_container_3 {
    grid-area: nav;
  }

  .reset_button {
    position: absolute;
    top: 8px;
    right: 8px;
  }
</style>
