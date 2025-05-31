import Inventory from '@domain/entities/Inventory';
import { DocumentSnapshot } from 'firebase/firestore';

export interface InventoryRepository {
  add(inventory: Inventory): Promise<Inventory>;
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Inventory[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
};
