import reducer from '../../src/App/reducer';
import Inventory from '../../src/domain/entities/Inventory';
import Farm from '../../src/domain/entities/Farm';
import Product from '../../src/domain/entities/Product';
import { State, ActionType } from '../../src/App/types';

describe('inventory reducer', () => {
  const farm = new Farm('farm1', 'Farm Name', { _lat: 0, _long: 0 }, []);
  const product = new Product('prod1', 'Tomato', 5.5, 30);
  const inventory = new Inventory(
    'inv1',
    farm,
    [{ product, amount: 10 }],
    'READY',
    new Date()
  );

  const initialState: State = {
    list: [],
    loading: true,
    hasMore: true,
    lastDoc: undefined,
  };

  it('should handle SET_INVENTORY', () => {
    const action: ActionType = {
      type: 'SET_INVENTORY',
      list: [inventory],
      hasMore: false,
      lastDoc: { id: 'mock' } as any,
    };

    const state = reducer(initialState, action);

    expect(state.list).toEqual([inventory]);
    expect(state.hasMore).toBe(false);
    expect(state.lastDoc).toEqual({ id: 'mock' });
    expect(state.loading).toBe(false);
  });

  it('should handle ADD_INVENTORY', () => {
    const action: ActionType = {
      type: 'ADD_INVENTORY',
      item: inventory,
    };

    const state = reducer(initialState, action);

    expect(state.list).toEqual([inventory]);
  });

  it('should handle SET_LOADING', () => {
    const action: ActionType = {
      type: 'SET_LOADING',
      loading: false,
    };

    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
  });

  it('should throw on unknown action type', () => {
    const action = { type: 'UNKNOWN_ACTION' } as any;

    expect(() => reducer(initialState, action)).toThrow('Unhandled action');
  });
});
