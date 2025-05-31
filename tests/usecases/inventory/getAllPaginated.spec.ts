import { InventoryRepository } from '../../../src/domain/repositories/InventoryRepository';
import GetAllPaginatedInventoryUseCase from '../../../src/usecases/inventory/getAllPaginated';
import Inventory from '../../../src/domain/entities/Inventory';
import Farm from '../../../src/domain/entities/Farm';
import Product from '../../../src/domain/entities/Product';

describe('GetAllPaginatedInventoryUseCase', () => {
  it('should return a list of paginated inventories', async () => {
    const mockFarm = new Farm('farm1', 'Farm Name', { _lat: 0, _long: 0 }, []);
    const mockProduct = new Product('prod1', 'Tomato', 5.5, 30);
    const mockInventory = new Inventory(
      'inv1',
      mockFarm,
      [{ product: mockProduct, amount: 10 }],
      'IN_PRODUCTION',
      new Date()
    );

    const mockPaginatedResult = {
      list: [mockInventory],
      lastDoc: {} as any,
      hasMore: true,
    };

    const repository: jest.Mocked<InventoryRepository> = {
      add: jest.fn(),
      getAllPaginated: jest.fn().mockResolvedValue(mockPaginatedResult),
    } as any;

    const useCase = new GetAllPaginatedInventoryUseCase(repository);

    const result = await useCase.execute();

    expect(repository.getAllPaginated).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockPaginatedResult);
  });

  it('should pass last document when provided', async () => {
    const lastDoc = { id: 'mock-doc' } as any;

    const repository: jest.Mocked<InventoryRepository> = {
      add: jest.fn(),
      getAllPaginated: jest.fn().mockResolvedValue({ list: [], lastDoc: null, hasMore: false }),
    } as any;

    const useCase = new GetAllPaginatedInventoryUseCase(repository);

    await useCase.execute(lastDoc);

    expect(repository.getAllPaginated).toHaveBeenCalledWith(lastDoc);
  });
});
