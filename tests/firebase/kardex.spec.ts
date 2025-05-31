import { firebaseKardex } from '../../src/firebase/kardex';
import { collection, doc, getDocs, query, where, updateDoc, addDoc } from 'firebase/firestore';
import Kardex from '../../src/domain/entities/Kardex';

jest.mock('firebase/firestore');

describe('KardexService', () => {
  const mockCollectionRef = {};
  const mockQuery = {};

  beforeEach(() => {
    jest.clearAllMocks();

    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (doc as jest.Mock).mockImplementation((_, path, id) => ({ id }));
    (query as jest.Mock).mockReturnValue(mockQuery);
  });

  it('should return null if no kardex document matches filters', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ empty: true });

    const result = await firebaseKardex.getByFarmProductState('farm123', 'product456', 'stored');

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'kardex');
    expect(where).toHaveBeenCalledTimes(3);
    expect(result).toBeNull();
  });

  it('should return a Kardex instance if a document is found', async () => {
    const fakeData = { amount: 100 };
    const fakeSnap = {
      empty: false,
      docs: [
        {
          id: 'kardex789',
          data: () => fakeData,
        },
      ],
    };

    (getDocs as jest.Mock).mockResolvedValue(fakeSnap);

    const result = await firebaseKardex.getByFarmProductState('farm123', 'product456', 'stored');

    expect(result).toBeInstanceOf(Kardex);
    expect(result).toEqual(
      new Kardex('kardex789', 'farm123', 'product456', 'stored', 100)
    );
  });

  it('should call updateDoc with correct parameters', async () => {
    await firebaseKardex.updateAmount('kardex789', 500);

    expect(updateDoc).toHaveBeenCalledWith(
      { id: 'kardex789' },
      { amount: 500 }
    );
  });

  it('should create a new kardex document in Firestore', async () => {
    const kardex = new Kardex('', 'farm123', 'product456', 'stored', 75);

    await firebaseKardex.create(kardex);

    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      farm_id: { id: 'farm123' },
      product_id: { id: 'product456' },
      state: 'stored',
      amount: 75,
    });
  });
});
