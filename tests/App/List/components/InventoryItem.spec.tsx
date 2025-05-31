import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../__mocks__/renderWithTheme';
import InventoryItem from '../../../../src/App/List/components/InventoryItem';
import Inventory from '../../../../src/domain/entities/Inventory';
import Product from '../../../../src/domain/entities/Product';
import Farm from '../../../../src/domain/entities/Farm';

const mockProduct = new Product('prod-1', 'Tomate', 10, 30);
const mockFarm = new Farm('farm-1', 'Fazenda Verde', { _lat: 0, _long: 0 }, []);
const mockInventory = new Inventory(
  'inv-1',
  mockFarm,
  [{ product: mockProduct, amount: 50 }],
  'WAITING',
  new Date('2024-01-15T14:30:00')
);

describe('InventoryItem from list component', () => {
  it('renders farm name and date', () => {
    renderWithTheme(<InventoryItem item={mockInventory} />);
    expect(screen.getByText('Fazenda Verde')).toBeInTheDocument();
    expect(screen.getByText("15/01/2024 às 14:30h")).toBeInTheDocument();

    fireEvent.click(screen.getByText('Fazenda Verde'));
    expect(screen.getByText('Quantidade')).toBeInTheDocument();
    expect(screen.getByText('Ciclo')).toBeInTheDocument();
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('30 dias')).toBeInTheDocument();
  });

  it('renders state chip with correct label', () => {
    renderWithTheme(<InventoryItem item={mockInventory} />);
    expect(screen.getByText('Aguardando plantio')).toBeInTheDocument();
  });
});
