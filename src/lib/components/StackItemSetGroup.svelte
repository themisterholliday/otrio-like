<script lang="ts">
  import type {
    StackItem as GameStackItem,
    Size,
    StackItemAndIndex,
  } from '../game/game_state';
  import {chunk} from '../util/chunk';
  import StackItem from './StackItem.svelte';

  export let direction = 'row';
  export let color = 'magenta';
  export let highlighted = false;

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
      color_small: has_small ? color : undefined,
      color_medium: has_medium ? color : undefined,
      color_large: has_large ? color : undefined,
      stack_items: group,
    };
  });

  let selected_item: StackItemAndIndex | undefined = undefined;
  let selected_size: Size = 'small';

  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher<{
    selected_item: StackItemAndIndex;
  }>();

  function handle_stack_item_click(stack_items: StackItemAndIndex[]) {
    const selectable_items = stack_items.filter(
      item => item.stack_item.location === undefined
    );

    let item = selectable_items.find(
      item => item.stack_item.size === selected_size
    );
    let index = selectable_items.findIndex(
      item => item.stack_item.size === selected_size
    );

    if (item === undefined) {
      return;
    }

    const next_index = index + 1 < selectable_items.length ? index + 1 : 0;
    selected_size = selectable_items[next_index].stack_item.size;

    selected_item = item;
    dispatch('selected_item', selected_item);
  }

  function is_highlighted(
    stack_items: StackItemAndIndex[],
    selected_item: StackItemAndIndex | undefined
  ) {
    if (selected_item !== undefined) {
      return stack_items.includes(selected_item) === true
        ? selected_item.stack_item.size
        : undefined;
    }
    return undefined;
  }
</script>

<div class="container {highlighted ? 'highlight' : ''}">
  <div
    class="stack_item_container"
    style="--columns:{direction === 'row' ? 3 : 1};"
  >
    {#each stack_item_size_group as group}
      <StackItem
        color_small={group.color_small}
        color_medium={group.color_medium}
        color_large={group.color_large}
        is_disabled={highlighted === false}
        highlight={is_highlighted(group.stack_items, selected_item)}
        on:click={() => handle_stack_item_click(group.stack_items)}
      />
    {/each}
  </div>
</div>

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 2rem;
  }

  .stack_item_container {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 0.5rem;
  }

  .highlight {
    outline: 0.4vw solid gold;
  }
</style>
