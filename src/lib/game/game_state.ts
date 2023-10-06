// *===================================
// * Game State & Usage
// *===================================

export type Size = 'small' | 'medium' | 'large';

export interface StackItem {
  set: number;
  size: Size;
  location?: [number, number];
}

export interface PlacedStackItem {
  size: Size;
  location: [number, number];
}

export interface GameState {
  state: 'playing' | 'ended';
  stack_items: StackItem[];
  active_set: number;
  winner?: number;
}

export interface StackItemAndIndex {
  stack_item: StackItem;
  index: number;
}

export interface GameStateManager {
  game_state: GameState;

  update_stack_item_location: (
    index: number,
    location: [number, number]
  ) => void;

  get_stack_items_for_set: (set: number) => StackItemAndIndex[];
}

function _get_stack_items_for_set(all_stack_items: StackItem[], set: number) {
  return all_stack_items
    .map((value, index) => ({stack_item: value, index}))
    .filter(item => item.stack_item.set === set);
}

export function get_game_state_manager(
  didUpdate?: () => void
): GameStateManager {
  const state = get_default_game_state();
  console.log(state);

  return {
    game_state: state,
    update_stack_item_location: (index, location) => {
      const {size, location: stack_item_location} = state.stack_items[index];

      // if location already set for index, disallow
      if (stack_item_location !== undefined) {
        console.warn('Stack item already has location');
        return;
      }

      // if location and size is already used, disallow
      const existing_items = state.stack_items.filter(item => {
        return item.size === size && item.location === location;
      });
      if (existing_items.length > 0) {
        console.warn('There are existing items for this location and size');
        return;
      }

      // todo: disallow moves for non-active set items
      state.stack_items[index].location = location;

      // check did this set win
      // only check the current set to reduce items to check
      const current_set_stack_items = _get_stack_items_for_set(
        state.stack_items,
        state.active_set
      ).map(item => item.stack_item);

      const is_there_a_winner = is_there_a_winner_in_stack_items(
        current_set_stack_items
      );

      if (is_there_a_winner === true) {
        state.winner = state.active_set;
        state.state = 'ended';
        didUpdate?.();
      } else {
        state.active_set = state.active_set < 3 ? (state.active_set += 1) : 0;
        didUpdate?.();
      }
    },
    get_stack_items_for_set: set => {
      return _get_stack_items_for_set(state.stack_items, set);
    },
  };
}

// *===================================
// * Default Items
// *===================================

function get_defualt_stack_items(): StackItem[] {
  return [
    ...[0, 1, 2, 3].flatMap(set => {
      const items: StackItem[] = [
        {
          set,
          size: 'small',
        },
        {
          set,
          size: 'medium',
        },
        {
          set,
          size: 'large',
        },
      ];
      // Have to deep copy items
      const items_1 = JSON.parse(JSON.stringify(items));
      const items_2 = JSON.parse(JSON.stringify(items));
      const items_3 = JSON.parse(JSON.stringify(items));
      return [...items_1, ...items_2, ...items_3];
    }),
  ];
}

function get_default_game_state(): GameState {
  return {
    state: 'playing',
    stack_items: get_defualt_stack_items(),
    active_set: 0,
  };
}

// *===================================
// * Validations
// *===================================

function format_location_to_key(location: [number, number]) {
  return location.join('_');
}

function check_is_all_the_same_size(stack_items: PlacedStackItem[]): boolean {
  if (stack_items.length !== 3) {
    // throw new Error(
    //   `Stack Items is ${stack_items.length} which is not the required 3`
    // );
    return false;
  }
  const {size} = stack_items[0];
  return stack_items.every(item => item.size === size);
}

function check_is_ascending(stack_items: PlacedStackItem[]): boolean {
  if (stack_items.length !== 3) {
    // throw new Error(
    //   `Stack Items is ${stack_items.length} which is not the required 3`
    // );
    return false;
  }

  return (
    stack_items[0].size === 'small' &&
    stack_items[1].size === 'medium' &&
    stack_items[2].size === 'large'
  );
}

function check_is_descending(stack_items: PlacedStackItem[]): boolean {
  if (stack_items.length !== 3) {
    // throw new Error(
    //   `Stack Items is ${stack_items.length} which is not the required 3`
    // );
    return false;
  }

  return (
    stack_items[0].size === 'large' &&
    stack_items[1].size === 'medium' &&
    stack_items[2].size === 'small'
  );
}

function check_all(stack_items: PlacedStackItem[]) {
  return (
    check_is_all_the_same_size(stack_items) ||
    check_is_ascending(stack_items) ||
    check_is_descending(stack_items)
  );
}

function get_all_combinations(
  one: PlacedStackItem[],
  two: PlacedStackItem[],
  three: PlacedStackItem[]
) {
  const items = [];
  for (const item_one of one) {
    for (const item_two of two) {
      for (const item_three of three) {
        items.push([item_one, item_two, item_three]);
      }
    }
  }
  return items;
}

function get_all_from_locations(
  map: Map<string, PlacedStackItem[]>,
  location_one: [number, number],
  location_two: [number, number],
  location_three: [number, number]
) {
  const items_0_0 = map.get(format_location_to_key(location_one));
  const items_1_1 = map.get(format_location_to_key(location_two));
  const items_2_2 = map.get(format_location_to_key(location_three));

  // if any are undefined, return nothing
  if (
    items_0_0 === undefined ||
    items_1_1 === undefined ||
    items_2_2 === undefined
  ) {
    return [];
  }

  // if any are empty, return nothing
  if (items_0_0.length <= 0 || items_1_1.length <= 0 || items_2_2.length <= 0) {
    return [];
  }

  // make all combinations
  const combinations = get_all_combinations(items_0_0, items_1_1, items_2_2);
  return combinations;
}

function get_all_rows(map: Map<string, PlacedStackItem[]>) {
  const items = [
    ...get_all_from_locations(map, [0, 0], [1, 0], [2, 0]),
    ...get_all_from_locations(map, [0, 1], [1, 1], [2, 1]),
    ...get_all_from_locations(map, [0, 2], [1, 2], [2, 2]),
  ];
  return items;
}

function get_all_columns(map: Map<string, PlacedStackItem[]>) {
  const items = [
    ...get_all_from_locations(map, [0, 0], [0, 1], [0, 2]),
    ...get_all_from_locations(map, [1, 0], [1, 1], [1, 2]),
    ...get_all_from_locations(map, [2, 0], [2, 1], [2, 2]),
  ];
  return items;
}

function get_all_cross(map: Map<string, PlacedStackItem[]>) {
  return get_all_from_locations(map, [0, 0], [1, 1], [2, 2]);
}

function get_all_anti_cross(map: Map<string, PlacedStackItem[]>) {
  return get_all_from_locations(map, [2, 0], [1, 1], [0, 2]);
}

function get_all_nodes(map: Map<string, PlacedStackItem[]>) {
  const nodes: [number, number][] = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ];
  const items = nodes
    .map(node => {
      return map.get(format_location_to_key(node));
    })
    .flatMap(x => (x ? [x] : []));

  return items;
}

export function is_there_a_winner_in_stack_items(
  stack_items: StackItem[]
): boolean {
  /**
   * [0, 0], [1, 0], [2, 0] check x
   * [0, 0], [0, 1], [0, 2] check y
   * [0, 0], [1, 1], [2, 2] check cross
   * in each node
   */
  // check matching size - x, y, cross
  // check asc/dec - x, y, cross, and in each node

  // group all by location
  const map: Map<string, PlacedStackItem[]> = new Map();

  for (const item of stack_items) {
    const {location, size} = item;
    if (location === undefined) {
      continue;
    }
    const key = format_location_to_key(location);
    const map_value = map.get(key);
    const placed_item = {location, size};
    if (map_value === undefined) {
      map.set(key, [placed_item]);
    } else {
      map.set(key, [...map_value, placed_item]);
    }
  }

  // check rows
  const rows = get_all_rows(map);
  for (const item of rows) {
    if (check_all(item) === true) {
      return true;
    }
  }

  // check columns
  const columns = get_all_columns(map);
  for (const item of columns) {
    if (check_all(item) === true) {
      return true;
    }
  }

  // check crosses
  const crosses = get_all_cross(map);
  for (const item of crosses) {
    if (check_all(item) === true) {
      return true;
    }
  }

  // check anti crosses
  const anti_crosses = get_all_anti_cross(map);
  for (const item of anti_crosses) {
    if (check_all(item) === true) {
      return true;
    }
  }

  // check all nodes
  const all_nodes = get_all_nodes(map);
  for (const item of all_nodes) {
    if (check_all(item) === true) {
      return true;
    }
  }

  return false;
}
