import { render, screen, fireEvent } from '@testing-library/react';
import { useInventoryContext } from '../../../src/App/context';
import List from '../../../src/App/List';
import Inventory from '../../../src/domain/entities/Inventory';
import Product from '../../../src/domain/entities/Product';
import Farm from '../../../src/domain/entities/Farm';

jest.mock('../../../src/App/context', () => ({
  useInventoryContext: jest.fn(),
}));

const mockProduct = new Product('prod1', 'Milho', 15, 60);
const mockFarm = new Farm('farm1', 'Fazenda Sol', { _lat: 0, _long: 0 }, []);
const mockInventory = new Inventory(
  'inv1',
  mockFarm,
  [{ product: mockProduct, amount: 50 }],
  'WAITING',
  new Date()
);

describe('List component', () => {
  it('renders inventory items from context', () => {
    (useInventoryContext as jest.Mock).mockReturnValue({
      state: {
        list: [mockInventory],
        hasMore: false,
        loading: false,
        lastDoc: undefined,
      },
      getMoreInventory: jest.fn(),
      dispatch: jest.fn(),
    });

    render(<List />);
    expect(screen.getByText('Fazenda Sol')).toBeInTheDocument();
    expect(screen.queryByText('Carregar mais')).not.toBeInTheDocument();
  });

  it('shows loading spinner when loading is true', () => {
    (useInventoryContext as jest.Mock).mockReturnValue({
      state: {
        list: [],
        hasMore: false,
        loading: true,
        lastDoc: undefined,
      },
      getMoreInventory: jest.fn(),
      dispatch: jest.fn(),
    });

    render(<List />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders "Carregar mais" button when hasMore is true and not loading', () => {
    (useInventoryContext as jest.Mock).mockReturnValue({
      state: {
        list: [],
        hasMore: true,
        loading: false,
        lastDoc: undefined,
      },
      getMoreInventory: jest.fn(),
      dispatch: jest.fn(),
    });

    render(<List />);
    expect(screen.getByText('Carregar mais')).toBeInTheDocument();
  });

  it('calls getMoreInventory when "Carregar mais" button is clicked', () => {
    const getMoreInventoryMock = jest.fn();

    (useInventoryContext as jest.Mock).mockReturnValue({
      state: {
        list: [],
        hasMore: true,
        loading: false,
        lastDoc: undefined,
      },
      getMoreInventory: getMoreInventoryMock,
      dispatch: jest.fn(),
    });

    render(<List />);
    fireEvent.click(screen.getByText('Carregar mais'));
    expect(getMoreInventoryMock).toHaveBeenCalled();
  });
});
