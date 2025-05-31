import { getDocs, getDoc } from 'firebase/firestore';
import { firebaseFarm } from '../../src/firebase/farm';
import Product from '../../src/domain/entities/Product';
import Farm from '../../src/domain/entities/Farm';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  query: jest.fn(),
}));

describe('FirebaseFarm', () => {
  it('fetches farms and resolves product references correctly', async () => {
    const productRef = { id: 'product123' };
    const productSnap = {
      exists: () => true,
      id: 'product123',
      data: () => ({
        name: 'Tomato',
        unit_value: 5.5,
        cycle_days: 30,
      }),
    };
    (getDoc as jest.Mock).mockResolvedValue(productSnap);

    const farmDoc = {
      id: 'farm1',
      data: () => ({
        name: 'Green Farm',
        geolocation: { _lat: 1, _long: 2 },
        available_products: [productRef],
      }),
    };

    (getDocs as jest.Mock).mockResolvedValue({
      docs: [farmDoc],
    });

    const farms = await firebaseFarm.getAll();

    expect(farms).toHaveLength(1);
    const farm = farms[0];

    expect(farm).toBeInstanceOf(Farm);
    expect(farm.id).toBe('farm1');
    expect(farm.name).toBe('Green Farm');
    expect(farm.geolocation).toEqual({ _lat: 1, _long: 2 });
    expect(farm.available_products).toHaveLength(1);

    const product = farm.available_products[0];
    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBe('product123');
    expect(product.name).toBe('Tomato');
    expect(product.unit_value).toBe(5.5);
    expect(product.cycle_days).toBe(30);
  });

  it('skips unavailable products gracefully', async () => {
    const productRef = { id: 'missingProduct' };
    const farmDoc = {
      id: 'farm2',
      data: () => ({
        name: 'Dry Farm',
        geolocation: { _lat: 3, _long: 4 },
        available_products: [productRef],
      }),
    };

    (getDocs as jest.Mock).mockResolvedValue({ docs: [farmDoc] });
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });

    const farms = await firebaseFarm.getAll();

    expect(farms).toHaveLength(1);
    expect(farms[0].available_products).toEqual([]);
  });
});
