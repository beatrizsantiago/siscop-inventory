import { getDocs, getDoc, Timestamp, addDoc } from 'firebase/firestore';
import { firebaseInventory } from '../../src/firebase/inventory';
import Inventory from '../../src/domain/entities/Inventory';
import Product from '../../src/domain/entities/Product';
import Farm from '../../src/domain/entities/Farm';

const mockCollectionRef = {};

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    collection: jest.fn(() => mockCollectionRef),
    query: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    startAfter: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn((_, path, id) => ({ id: id || path })),
    Timestamp: {
      fromDate: jest.fn((date) => ({
        toDate: () => date,
        mockDate: date,
      })),
    },
  };
});

describe('FirebaseInventory.add', () => {
  it('converts and stores inventory data correctly', async () => {
    const farm = new Farm('farm123', 'Farm A', { _lat: 10, _long: 20 }, []);
    const product = new Product('prod456', 'Tomato', 12.5, 20);
    const inventoryDate = new Date();

    const inventory = new Inventory(
      '',
      farm,
      [{ product, amount: 30 }],
      'stored',
      inventoryDate
    );

    (addDoc as jest.Mock).mockResolvedValue({ id: 'inv789' });

    const result = await firebaseInventory.add(inventory);

    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      farm_id: { id: 'farm123' },
      items: [{
        product_id: { id: 'prod456' },
        amount: 30,
      }],
      state: 'stored',
      created_at: expect.objectContaining({
        mockDate: inventoryDate,
      }),
    });

    expect(result.id).toBe('inv789');
    expect(result.farm.name).toBe('Farm A');
    expect(result.items[0].product.name).toBe('Tomato');
  });
});

describe('FirebaseInventory.getAllPaginated', () => {
  it('fetches and resolves inventories, farms, and products correctly', async () => {
    const mockFarmRef = { id: 'farm1' };
    const mockFarmSnap = {
      exists: () => true,
      data: () => ({
        name: 'Test Farm',
        geolocation: { _lat: 1, _long: 2 },
        available_products: ['prod1'],
      }),
    };

    const mockProductRef = { id: 'product1' };
    const mockProductSnap = {
      exists: () => true,
      data: () => ({
        name: 'Tomato',
        unit_value: 10,
        cycle_days: 15,
      }),
    };

    const mockDocSnap = {
      id: 'inventory1',
      data: () => ({
        farm_id: mockFarmRef,
        state: 'active',
        created_at: Timestamp.fromDate(new Date()),
        items: [{
          product_id: mockProductRef,
          amount: 5,
        }],
      }),
    };

    (getDocs as jest.Mock).mockResolvedValue({
      docs: [mockDocSnap],
    });

    (getDoc as jest.Mock)
      .mockResolvedValueOnce(mockFarmSnap)
      .mockResolvedValueOnce(mockProductSnap);

    const result = await firebaseInventory.getAllPaginated();

    expect(result.list).toHaveLength(1);
    const inventory = result.list[0];

    expect(inventory).toBeInstanceOf(Inventory);
    expect(inventory.id).toBe('inventory1');
    expect(inventory.farm).toBeInstanceOf(Farm);
    expect(inventory.items[0].product).toBeInstanceOf(Product);
    expect(result.hasMore).toBe(false);
  });

  it('returns hasMore true when page is full', async () => {
    const mockDoc = {
      id: 'inventoryX',
      data: () => ({
        farm_id: { id: 'f' },
        created_at: Timestamp.fromDate(new Date()),
        state: 'pending',
        items: [],
      }),
    };

    (getDocs as jest.Mock).mockResolvedValue({
      docs: new Array(10).fill(mockDoc),
    });

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: 'Any',
        geolocation: { _lat: 0, _long: 0 },
        available_products: [],
      }),
    });

    const result = await firebaseInventory.getAllPaginated();

    expect(result.list.length).toBe(10);
    expect(result.hasMore).toBe(true);
  });
});
