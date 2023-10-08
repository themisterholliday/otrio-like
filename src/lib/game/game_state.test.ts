import {describe, expect, it, vi} from 'vitest';
import {get_game_state_manager} from './game_state';

describe('Game State is Init', () => {
  it('has default game state', () => {
    const didUpdate = () => {};
    const state_manager = get_game_state_manager(didUpdate);
    expect(state_manager.game_state.active_set).toEqual(0);
    expect(state_manager.game_state.state).toEqual('playing');
    expect(state_manager.game_state.stack_items).toHaveLength(36);
  });
});

describe('Game State is Playing', () => {
  it('cycles turns', () => {
    const didUpdate = () => {};
    const state_manager = get_game_state_manager(didUpdate);
    expect(state_manager.game_state.active_set).toEqual(0);

    state_manager.update_stack_item_location(0, [0, 0]);
    expect(state_manager.game_state.active_set).toEqual(1);

    state_manager.update_stack_item_location(1, [0, 1]);
    expect(state_manager.game_state.active_set).toEqual(2);

    state_manager.update_stack_item_location(2, [0, 2]);
    expect(state_manager.game_state.active_set).toEqual(3);

    state_manager.update_stack_item_location(3, [1, 0]);
    expect(state_manager.game_state.active_set).toEqual(0);
  });

  it('calls didUpdate on actions', () => {
    const mock_didUpdate = vi.fn();
    const state_manager = get_game_state_manager(mock_didUpdate);

    state_manager.update_stack_item_location(0, [0, 0]);
    state_manager.update_stack_item_location(1, [0, 1]);
    state_manager.update_stack_item_location(2, [0, 2]);
    expect(mock_didUpdate).toHaveBeenCalledTimes(3);
  });

  it('accepts legal actions', () => {
    const didUpdate = () => {};
    const state_manager = get_game_state_manager(didUpdate);

    state_manager.update_stack_item_location(0, [0, 0]);
    expect(
      state_manager.get_stack_items_for_set(0)[0].stack_item.location
    ).toEqual([0, 0]);
    state_manager.update_stack_item_location(1, [0, 1]);
    expect(
      state_manager.get_stack_items_for_set(0)[1].stack_item.location
    ).toEqual([0, 1]);
  });

  it('disallows illegal actions - update location twice', () => {
    const didUpdate = () => {};
    const state_manager = get_game_state_manager(didUpdate);

    state_manager.update_stack_item_location(0, [0, 0]);

    expect(
      state_manager.get_stack_items_for_set(0)[0].stack_item.location
    ).toEqual([0, 0]);
    state_manager.update_stack_item_location(0, [0, 1]);
    expect(
      state_manager.get_stack_items_for_set(0)[0].stack_item.location
    ).toEqual([0, 0]);
  });

  it('disallows illegal actions - duplicate location', () => {
    const didUpdate = () => {};
    const state_manager = get_game_state_manager(didUpdate);

    state_manager.update_stack_item_location(0, [0, 0]);
    expect(
      state_manager.get_stack_items_for_set(0)[0].stack_item.location
    ).toEqual([0, 0]);
    state_manager.update_stack_item_location(3, [0, 0]);
    expect(
      state_manager.get_stack_items_for_set(0)[3].stack_item.location
    ).toEqual(undefined);
  });

  it.todo('disallows illegal actions - non-active set actions');
  it.todo('disallows illegal actions - game is ended');
});

describe.todo('is_there_a_winner_in_stack_items()', () => {
  it.todo('More complex stack items', () => {});

  it.todo('Should win with stack items', () => {});

  it.todo('Should NOT win with stack items', () => {});
});

describe('Game Examples', () => {
  it('node 0 - ascending', () => {
    // all 4 sets go 2 times and the 3 action from set 0 wins the game
    const didUpdate = () => {};
    const {get_stack_items_for_set, update_stack_item_location, game_state} =
      get_game_state_manager(didUpdate);

    const set_0 = get_stack_items_for_set(0);
    const set_1 = get_stack_items_for_set(1);
    const set_2 = get_stack_items_for_set(2);
    const set_3 = get_stack_items_for_set(3);

    // turn 1
    update_stack_item_location(set_0[0].index, [0, 0]);
    update_stack_item_location(set_1[0].index, [0, 1]);
    update_stack_item_location(set_2[0].index, [0, 2]);
    update_stack_item_location(set_3[0].index, [1, 0]);

    // turn 2
    update_stack_item_location(set_0[1].index, [0, 0]);
    update_stack_item_location(set_1[1].index, [0, 1]);
    update_stack_item_location(set_2[1].index, [0, 2]);
    update_stack_item_location(set_3[1].index, [1, 0]);

    // turn 3
    update_stack_item_location(set_0[2].index, [0, 0]);

    expect(game_state.state).toEqual('ended');
    expect(game_state.winner).toEqual(0);
  });

  it('cross 0 - ascending', () => {
    // all 4 sets go 2 times and the 3 action from set 0 wins the game
    const didUpdate = () => {};
    const {get_stack_items_for_set, update_stack_item_location, game_state} =
      get_game_state_manager(didUpdate);

    const set_0 = get_stack_items_for_set(0);
    const set_1 = get_stack_items_for_set(1);
    const set_2 = get_stack_items_for_set(2);
    const set_3 = get_stack_items_for_set(3);

    // turn 1
    update_stack_item_location(set_0[0].index, [0, 0]);
    update_stack_item_location(set_1[0].index, [0, 1]);
    update_stack_item_location(set_2[0].index, [0, 2]);
    update_stack_item_location(set_3[0].index, [1, 0]);

    // turn 2
    update_stack_item_location(set_0[1].index, [1, 1]);
    update_stack_item_location(set_1[1].index, [0, 1]);
    update_stack_item_location(set_2[1].index, [0, 2]);
    update_stack_item_location(set_3[1].index, [1, 0]);

    // turn 3
    update_stack_item_location(set_0[2].index, [2, 2]);

    expect(game_state.state).toEqual('ended');
    expect(game_state.winner).toEqual(0);
  });

  it('anti-cross 0 - ascending', () => {
    // all 4 sets go 2 times and the 3 action from set 0 wins the game
    const didUpdate = () => {};
    const {get_stack_items_for_set, update_stack_item_location, game_state} =
      get_game_state_manager(didUpdate);

    const set_0 = get_stack_items_for_set(0);
    const set_1 = get_stack_items_for_set(1);
    const set_2 = get_stack_items_for_set(2);
    const set_3 = get_stack_items_for_set(3);

    // turn 1
    update_stack_item_location(set_0[0].index, [2, 0]);
    update_stack_item_location(set_1[0].index, [0, 1]);
    update_stack_item_location(set_2[0].index, [0, 2]);
    update_stack_item_location(set_3[0].index, [1, 0]);

    // turn 2
    update_stack_item_location(set_0[1].index, [1, 1]);
    update_stack_item_location(set_1[1].index, [0, 1]);
    update_stack_item_location(set_2[1].index, [0, 2]);
    update_stack_item_location(set_3[1].index, [1, 0]);

    // turn 3
    update_stack_item_location(set_0[2].index, [0, 2]);

    expect(game_state.state).toEqual('ended');
    expect(game_state.winner).toEqual(0);
  });

  it('row 0 - ascending', () => {
    // all 4 sets go 2 times and the 3 action from set 0 wins the game
    const didUpdate = () => {};
    const {get_stack_items_for_set, update_stack_item_location, game_state} =
      get_game_state_manager(didUpdate);

    const set_0 = get_stack_items_for_set(0);
    const set_1 = get_stack_items_for_set(1);
    const set_2 = get_stack_items_for_set(2);
    const set_3 = get_stack_items_for_set(3);

    // turn 1
    update_stack_item_location(set_0[0].index, [0, 0]);
    update_stack_item_location(set_1[0].index, [0, 1]);
    update_stack_item_location(set_2[0].index, [0, 2]);
    update_stack_item_location(set_3[0].index, [1, 0]);

    // turn 2
    update_stack_item_location(set_0[1].index, [1, 0]);
    update_stack_item_location(set_1[1].index, [0, 1]);
    update_stack_item_location(set_2[1].index, [0, 2]);
    update_stack_item_location(set_3[1].index, [1, 1]);

    // turn 3
    update_stack_item_location(set_0[2].index, [2, 0]);

    expect(game_state.state).toEqual('ended');
    expect(game_state.winner).toEqual(0);
  });

  it('column 0 - ascending', () => {
    // all 4 sets go 2 times and the 3 action from set 0 wins the game
    const didUpdate = () => {};
    const {get_stack_items_for_set, update_stack_item_location, game_state} =
      get_game_state_manager(didUpdate);

    const set_0 = get_stack_items_for_set(0);
    const set_1 = get_stack_items_for_set(1);
    const set_2 = get_stack_items_for_set(2);
    const set_3 = get_stack_items_for_set(3);

    // turn 1
    update_stack_item_location(set_0[0].index, [0, 0]);
    update_stack_item_location(set_1[0].index, [0, 1]);
    update_stack_item_location(set_2[0].index, [0, 2]);
    update_stack_item_location(set_3[0].index, [1, 0]);

    // turn 2
    update_stack_item_location(set_0[1].index, [1, 1]);
    update_stack_item_location(set_1[1].index, [0, 1]);
    update_stack_item_location(set_2[1].index, [0, 2]);
    update_stack_item_location(set_3[1].index, [1, 0]);

    // turn 3
    update_stack_item_location(set_0[2].index, [2, 2]);

    expect(game_state.state).toEqual('ended');
    expect(game_state.winner).toEqual(0);
  });
});
