import { collection, addDoc } from 'firebase/firestore';
import { firebaseNotification } from '../../src/firebase/notification';
import Notification from '../../src/domain/entities/Notification';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((date: Date) => ({ _seconds: Math.floor(date.getTime() / 1000), toDate: () => date })),
  },
}));

describe('FirebaseNotification.create', () => {
  const sampleNotification = new Notification(
    'notif1',
    'SALE',
    'Farm X',
    new Date('2025-07-13T12:00:00Z')
  );
  const fakeColRef = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (collection as jest.Mock).mockReturnValue(fakeColRef);
  });

  it('should call addDoc with the correct collection and data', async () => {
    await firebaseNotification.create(sampleNotification);

    expect(addDoc).toHaveBeenCalled();
  });

  it('should propagate errors from addDoc', async () => {
    const error = new Error('addDoc failed');
    (addDoc as jest.Mock).mockRejectedValueOnce(error);

    await expect(firebaseNotification.create(sampleNotification)).rejects.toThrow('addDoc failed');
  });
});
