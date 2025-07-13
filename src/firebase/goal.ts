
import Goal from '@domain/entities/Goal';
import { GoalRepository } from '@domain/repositories/GoalRepository';
import { collection, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';

import { firestore } from './config';

class FirebaseGoal implements GoalRepository {
  async findPendingProductionGoals(
    farmId: string,
    before: Date
  ): Promise<Goal[]> {
    const goalsCol = collection(firestore, 'goals');

    const farmRef = doc(firestore, 'farms', farmId);

    const q = query(
      goalsCol,
      where('farm_id', '==', farmRef),
      where('kind', '==', 'PRODUCTION'),
      where('finished', '==', false),
      where('created_at', '<=', Timestamp.fromDate(before)),
      orderBy('created_at', 'asc'),
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Goal[];

    return data;
  }

  async markAsFinished(goalId: string): Promise<void> {
    const ref = doc(firestore, 'goals', goalId);
    await updateDoc(ref, { finished: true });
  }
};

export const firebaseGoal = new FirebaseGoal();
