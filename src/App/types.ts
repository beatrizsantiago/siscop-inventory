import { DocumentSnapshot } from 'firebase/firestore';
import Inventory from '@domain/entities/Inventory';

export type State = {
  list: Inventory[],
  lastDoc?: DocumentSnapshot;
  hasMore: boolean;
  loading: boolean,
};

export type ActionType = { type: 'SET_INVENTORY', list: Inventory[], lastDoc?: DocumentSnapshot | null, hasMore: boolean }
| { type: 'ADD_INVENTORY', item: Inventory }
| { type: 'SET_LOADING', loading: boolean };

export type InventoryProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
  getMoreInventory: () => Promise<void>,
};

export type InventoryProviderProps = {
  children: React.ReactNode,
};
