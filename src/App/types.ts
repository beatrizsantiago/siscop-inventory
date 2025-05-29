import Inventory from '@domain/entities/Inventory';

export type State = {
  list: Inventory[],
  loading: boolean,
};

export type ActionType = { type: 'SET_INVENTORY', list: Inventory[] };

export type InventoryProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
};

export type InventoryProviderProps = {
  children: React.ReactNode,
};
