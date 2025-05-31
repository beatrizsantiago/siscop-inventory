import { collection, doc, getDocs, query, where, updateDoc, addDoc } from 'firebase/firestore';
import { KardexRepository } from '@domain/repositories/KardexRepository';
import Kardex from '@domain/entities/Kardex';

import { firestore } from './config';

class KardexService implements KardexRepository {
  async getByFarmProductState(farmId: string, productId: string, state: string): Promise<Kardex | null> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', state)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    return new Kardex(
      docSnap.id,
      farmId,
      productId,
      state,
      data.amount,
    );
  };

  async updateAmount(id: string, newAmount: number): Promise<void> {
    const ref = doc(firestore, 'kardex', id);
    await updateDoc(ref, { amount: newAmount });
  };

  async create(kardex: Kardex): Promise<void> {
    const farmRef = doc(firestore, 'farms', kardex.farm_id);
    const productRef = doc(firestore, 'products', kardex.product_id);

    await addDoc(collection(firestore, 'kardex'), {
      farm_id: farmRef,
      product_id: productRef,
      state: kardex.state,
      amount: kardex.amount,
    });
  };
};

export const firebaseKardex = new KardexService();
