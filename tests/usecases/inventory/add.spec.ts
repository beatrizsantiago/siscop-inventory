import AddInventoryUseCase from '../../../src/usecases/inventory/add';
import Inventory from '../../../src/domain/entities/Inventory';
import Kardex from '../../../src/domain/entities/Kardex';
import Product from '../../../src/domain/entities/Product';
import Farm from '../../../src/domain/entities/Farm';

describe('AddInventoryUseCase', () => {
  const mockFarm = new Farm('farm123', 'Farm A', { _lat: 0, _long: 0 }, []);
  const mockProduct = new Product('prod123', 'Tomato', 2, 30);
  const mockItem = { product: mockProduct, amount: 10 };

  const inventoryRepository = {
    add: jest.fn(),
  };

  const kardexRepository = {
    getByFarmProductState: jest.fn(),
    updateAmount: jest.fn(),
    create: jest.fn(),
  };

  const mockGoalRepository = {
    findPendingSalesGoals: jest.fn().mockResolvedValue([]),
    markAsFinished: jest.fn(),
  };

  const mockNotificationRepository = {
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if origin stock is insufficient', async () => {
    const useCase = new AddInventoryUseCase(
      inventoryRepository as any,
      kardexRepository as any,
      mockGoalRepository as any,
      mockNotificationRepository as any
    );

    kardexRepository.getByFarmProductState
      .mockResolvedValueOnce(new Kardex('k1', 'farm123', 'prod123', 'WAITING', 5));
     
    const params = {
      farm: mockFarm,
      items: [mockItem],
      state: 'IN_PRODUCTION',
    };

    await expect(useCase.execute(params)).rejects.toThrow('INSUFFICIENT_STOCK:Tomato');
    expect(kardexRepository.updateAmount).not.toHaveBeenCalled();
    expect(kardexRepository.create).not.toHaveBeenCalled();
    expect(inventoryRepository.add).not.toHaveBeenCalled();
  });

  it('should update origin and target kardex if both exist', async () => {
    const useCase = new AddInventoryUseCase(
      inventoryRepository as any,
      kardexRepository as any,
      mockGoalRepository as any,
      mockNotificationRepository as any
    );

    const originKardex = new Kardex('origin123', 'farm123', 'prod123', 'WAITING', 20);
    const targetKardex = new Kardex('target123', 'farm123', 'prod123', 'IN_PRODUCTION', 5);

    kardexRepository.getByFarmProductState
      .mockResolvedValueOnce(originKardex)
      .mockResolvedValueOnce(targetKardex);

    const tempInventory = new Inventory('', mockFarm, [mockItem], 'IN_PRODUCTION', new Date());

    inventoryRepository.add.mockResolvedValue({
      ...tempInventory,
      id: 'inv1',
    });

    const params = {
      farm: mockFarm,
      items: [mockItem],
      state: 'IN_PRODUCTION',
    };

    const result = await useCase.execute(params);

    expect(kardexRepository.updateAmount).toHaveBeenCalledWith('origin123', 10);
    expect(kardexRepository.updateAmount).toHaveBeenCalledWith('target123', 15);
    expect(inventoryRepository.add).toHaveBeenCalled();
    expect(result.id).toBe('inv1');
  });

  it('should create new kardex if target state does not exist', async () => {
    const useCase = new AddInventoryUseCase(
      inventoryRepository as any,
      kardexRepository as any,
      mockGoalRepository as any,
      mockNotificationRepository as any
    );

    kardexRepository.getByFarmProductState
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const params = {
      farm: mockFarm,
      items: [mockItem],
      state: 'WAITING',
    };

    const tempInventory = new Inventory('', mockFarm, [mockItem], 'WAITING', new Date());

    inventoryRepository.add.mockResolvedValue({
      ...tempInventory,
      id: 'inv2',
    });

    const result = await useCase.execute(params);

    expect(kardexRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      farm_id: 'farm123',
      product_id: 'prod123',
      state: 'WAITING',
      amount: 10,
    }));

    expect(result.id).toBe('inv2');
  });
});
