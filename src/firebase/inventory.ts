import { InventoryRepository } from '@domain/repositories/InventoryRepository';
import {
  collection, DocumentReference, getDoc, getDocs, query,
} from 'firebase/firestore';
import Inventory from '@domain/entities/Inventory';

import { firestore } from './config';

class FirebaseInventory implements InventoryRepository {
  async getAll(): Promise<Inventory[]> {
    const inventoryQuery = query(collection(firestore, 'inventory'));
    const snapshot = await getDocs(inventoryQuery);

    const list = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const farmRef = data.farm_id as DocumentReference;

      let farmName = null;

      if (farmRef) {
        const farmSnap = await getDoc(farmRef);
        if (farmSnap.exists()) {
          farmName = farmSnap.data().name;
        }
      }

      return {
        ...data,
        id: doc.id,
        farm_name: farmName,
        created_at: data.created_at.toDate(),
      } as Inventory;
    }));

    return list;
  };
};

export const firebaseInventory = new FirebaseInventory();