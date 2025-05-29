import { InventoryRepository } from '@domain/repositories/InventoryRepository';
import {
  collection, DocumentReference, getDoc, getDocs, query,
} from 'firebase/firestore';
import Inventory from '@domain/entities/Inventory';
import Product from '@domain/entities/Product';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

class FirebaseInventory implements InventoryRepository {
  async getAll(): Promise<Inventory[]> {
    const inventoryQuery = query(collection(firestore, 'inventory'));
    const snapshot = await getDocs(inventoryQuery);

    const list = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();

      const farmRef = data.farm_id as DocumentReference;
      let farm = null;

      if (farmRef) {
        const farmSnap = await getDoc(farmRef);
        if (farmSnap.exists()) {
          const farmData = farmSnap.data();
          farm = new Farm(
            farmRef.id,
            farmData.name,
            farmData.geolocation,
            farmData.available_products,
          );
        }
      }

      const items = await Promise.all(
        (data.items || []).map(async (itemData: any) => {
          const productRef = itemData.product_id as DocumentReference;
          let product = null;

          if (productRef) {
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const productData = productSnap.data();
              product = new Product(
                productRef.id,
                productData.name,
                productData.unit_value,
                productData.cycle_days
              );
            }
          }

          return {
            product: product!,
            amount: itemData.amount
          };
        })
      );

      return new Inventory(
        doc.id,
        farm!,
        items,
        data.state,
        data.created_at.toDate()
      );
    }));

    return list;
  };
};

export const firebaseInventory = new FirebaseInventory();
