import { NotificationRepository } from '@domain/repositories/NotificationRepository';
import {
  addDoc, collection, Timestamp,
} from 'firebase/firestore';
import Notification from '@domain/entities/Notification';

import { firestore } from './config';

class FirebaseNotification implements NotificationRepository {
  async create(params: Notification): Promise<void> {
    const notificationsCol = collection(firestore, 'notifications');
    
    const { farm_name, kind, created_at } = params;

    const data = {
      farm_name,
      kind,
      created_at: Timestamp.fromDate(created_at),
    };

    await addDoc(notificationsCol, data);
  }
};

export const firebaseNotification = new FirebaseNotification();
