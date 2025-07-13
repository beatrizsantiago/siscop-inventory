import Inventory from '@domain/entities/Inventory';
import { DocumentReference, DocumentSnapshot, Timestamp } from 'firebase/firestore';

export interface InventoryRepository {
  add(inventory: Inventory): Promise<Inventory>;
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Inventory[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
  sumAmountSince(farmId: string, productId: DocumentReference, state: string, since: Timestamp): Promise<number>;
};
