import { render, act } from '@testing-library/react';
import { useInventoryContext, InventoryProvider } from '../../src/App/context';
import GetInventoryUseCase from '../../src/usecases/inventory/getAllPaginated';
import Inventory from '../../src/domain/entities/Inventory';
import Farm from '../../src/domain/entities/Farm';
import Product from '../../src/domain/entities/Product';

jest.mock('../../src/usecases/inventory/getAllPaginated');

describe('InventoryProvider', () => {
  const mockInventory = new Inventory(
    'inv1',
    new Farm('farm1', 'Farm 1', { _lat: 0, _long: 0 }, []),
    [{ product: new Product('prod1', 'Tomato', 5.5, 30), amount: 5 }],
    'READY',
    new Date()
  );

  const mockResponse = {
    list: [mockInventory],
    lastDoc: { id: 'doc1' } as any,
    hasMore: true,
  };

  beforeEach(() => {
    (GetInventoryUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockResponse),
    }));
  });

  it('should fetch and store initial inventory on mount', async () => {
    let contextValue: any = null;

    const TestComponent = () => {
      contextValue = useInventoryContext();
      return null;
    };

    await act(async () => {
      render(
        <InventoryProvider>
          <TestComponent />
        </InventoryProvider>
      );
    });

    expect(contextValue.state.list).toHaveLength(1);
    expect(contextValue.state.list[0].id).toBe('inv1');
    expect(contextValue.state.hasMore).toBe(true);
    expect(contextValue.state.lastDoc).toEqual({ id: 'doc1' });
    expect(contextValue.state.loading).toBe(false);
  });

  it('should load more inventory when getMoreInventory is called', async () => {
    let contextValue: any = null;

    const TestComponent = () => {
      contextValue = useInventoryContext();
      return null;
    };

    await act(async () => {
      render(
        <InventoryProvider>
          <TestComponent />
        </InventoryProvider>
      );
    });

    await act(async () => {
      await contextValue.getMoreInventory();
    });

    expect(contextValue.state.list.length).toBe(2);
  });

  it('should not load more if hasMore is false or loading is true', async () => {
    let contextValue: any = null;

    const TestComponent = () => {
      contextValue = useInventoryContext();
      return null;
    };

    await act(async () => {
      render(
        <InventoryProvider>
          <TestComponent />
        </InventoryProvider>
      );
    });

    act(() => {
      contextValue.state.hasMore = false;
    });

    await act(async () => {
      await contextValue.getMoreInventory();
    });

    expect(contextValue.state.list.length).toBe(1);
  });
});
