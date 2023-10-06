<script lang="ts">
  import type {
    StackItem as GameStackItem,
    StackItemAndIndex,
  } from '../game/game_state';
  import {chunk} from '../util/chunk';
  import StackItem from './StackItem.svelte';

  export let direction = 'row';
  export let color = 'magenta';

  export let stack_items: StackItemAndIndex[];

  $: stack_item_size_group = chunk(stack_items, 3).map(group => {
    const valid_items = group.filter(
      item => item.stack_item.location === undefined
    );
    const has_small =
      valid_items.find(item => item.stack_item.size === 'small') !== undefined;
    const has_medium =
      valid_items.find(item => item.stack_item.size === 'medium') !== undefined;
    const has_large =
      valid_items.find(item => item.stack_item.size === 'large') !== undefined;
    return {
      color_small: has_small ? color : 'gray',
      color_medium: has_medium ? color : 'gray',
      color_large: has_large ? color : 'gray',
    };
  });
  let selected_size = 'small';
</script>

<div class="container">
  <div>
    <button
      class={selected_size === 'small' ? 'selected' : ''}
      on:click={() => (selected_size = 'small')}
    >
      small
    </button>
    <button
      class={selected_size === 'medium' ? 'selected' : ''}
      on:click={() => (selected_size = 'medium')}
    >
      medium
    </button>
    <button
      class={selected_size === 'large' ? 'selected' : ''}
      on:click={() => (selected_size = 'large')}
    >
      large
    </button>
  </div>
  <div
    class="stack_item_container"
    style="--columns:{direction === 'row' ? 3 : 1};"
  >
    {#each stack_item_size_group as group}
      <StackItem
        color_small={group.color_small}
        color_medium={group.color_medium}
        color_large={group.color_large}
      />
    {/each}
  </div>
</div>

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .stack_item_container {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 0.5rem;
  }

  .selected {
    background-color: #ff3e00;
    color: white;
  }
</style>
