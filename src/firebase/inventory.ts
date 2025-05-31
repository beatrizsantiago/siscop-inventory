import { InventoryRepository } from '@domain/repositories/InventoryRepository';
import {
  addDoc, collection, doc, DocumentReference, DocumentSnapshot,
  getDoc, getDocs, limit, orderBy, query, startAfter, Timestamp,
} from 'firebase/firestore';
import Inventory from '@domain/entities/Inventory';
import Product from '@domain/entities/Product';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

const PAGE_SIZE = 10;

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

  async getAllPaginated(
    lastDoc?: DocumentSnapshot
  ): Promise<{
    list: Inventory[];
    lastDoc: DocumentSnapshot;
    hasMore: boolean;
  }> {
    const inventoryRef = collection(firestore, 'inventory');

    let inventoryQuery = query(
      inventoryRef,
      orderBy('created_at', 'desc'),
      limit(PAGE_SIZE)
    );

    if (lastDoc) {
      inventoryQuery = query(
        inventoryRef,
        orderBy('created_at', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    }

    const snapshot = await getDocs(inventoryQuery);

    const inventories = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();

      const farmRef = data.farm_id as DocumentReference;
      let farm: Farm | null = null;

      if (farmRef) {
        const farmSnap = await getDoc(farmRef);
        if (farmSnap.exists()) {
          const farmData = farmSnap.data();
          farm = new Farm(
            farmRef.id,
            farmData.name,
            farmData.geolocation,
            farmData.available_products
          );
        }
      }

      const items = await Promise.all(
        (data.items || []).map(async (itemData: any) => {
          const productRef = itemData.product_id as DocumentReference;
          let product: Product | null = null;

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
        docSnap.id,
        farm!,
        items,
        data.state,
        data.created_at.toDate()
      );
    }));

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

    return {
      list: inventories,
      lastDoc: newLastDoc,
      hasMore: snapshot.docs.length === PAGE_SIZE,
    };
  }
};

export const firebaseInventory = new FirebaseInventory();
