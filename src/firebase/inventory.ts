import { InventoryRepository } from '@domain/repositories/InventoryRepository';
import {
  addDoc, collection, doc, DocumentReference,
  getDoc, getDocs, orderBy, query, Timestamp,
} from 'firebase/firestore';
import Inventory from '@domain/entities/Inventory';
import Product from '@domain/entities/Product';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

class FirebaseInventory implements InventoryRepository {
  async add(inventory: Inventory): Promise<Inventory> {
    const farmRef = doc(firestore, 'farms', inventory.farm.id);

    const inventoryData = {
      farm_id: farmRef,
      items: inventory.items.map(item => ({
        product_id: doc(firestore, 'products', item.product.id),
        amount: item.amount,
      })),
      state: inventory.state,
      created_at: Timestamp.fromDate(inventory.created_at),
    };

    const docRef = await addDoc(collection(firestore, 'inventory'), inventoryData);

    return {
      ...inventory,
      id: docRef.id,
    };
  }

  async getAll(): Promise<Inventory[]> {
    const inventoryQuery = query(
      collection(firestore, 'inventory'),
      orderBy('created_at', 'desc'),
    );

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
