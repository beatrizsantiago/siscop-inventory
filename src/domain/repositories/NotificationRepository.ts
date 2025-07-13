import Notification from '@domain/entities/Notification';

export interface NotificationRepository {
  create(params: Notification): Promise<void>;
};
