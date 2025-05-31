import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormContainer from '../../../../src/App/Add/components/Form';
import { useInventoryContext } from '../../../../src/App/context';
import useGetFarms from '../../../../src/hooks/useGetFarms';

jest.mock('../../../../src/App/context', () => ({
  useInventoryContext: jest.fn(),
}));

jest.mock('../../../../src/hooks/useGetFarms', () => jest.fn());

jest.mock('../../../../src/usecases/inventory/add', () => {
  return jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  }));
});

describe('FormContainer', () => {
  const mockDispatch = jest.fn();
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve permitir preencher e submeter o formulário', async () => {
    const mockFarm = {
      id: 'f1',
      name: 'Fazenda Teste',
      geolocation: { _lat: 0, _long: 0 },
      available_products: [
        { id: 'p1', name: 'Produto A', unit_value: 10, cycle_days: 5 },
      ],
    };

    (useGetFarms as jest.Mock).mockReturnValue({
      farms: [mockFarm],
      loading: false,
    });

    (useInventoryContext as jest.Mock).mockReturnValue({
      dispatch: mockDispatch,
    });

    render(<FormContainer handleClose={mockHandleClose} />);

    const fazendaInput = screen.getByLabelText(/Selecione a fazenda/i);
    await userEvent.click(fazendaInput);
    const option = await screen.findByText('Fazenda Teste');
    await userEvent.click(option);

    const estadoSelect = await screen.findByLabelText(/Estado/i);
    await userEvent.click(estadoSelect);
    await userEvent.click(screen.getByRole('option', { name: /Aguardando plantio/i }));

    const produtoInput = screen.getByLabelText(/Selecione o produto/i);
    await userEvent.click(produtoInput);
    await userEvent.click(screen.getByText('Produto A'));

    const quantidadeInput = screen.getByLabelText(/Quantidade/i);
    await userEvent.type(quantidadeInput, '10');

    const salvarButton = screen.getByRole('button', { name: /Salvar/i });
    await userEvent.click(salvarButton);

    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
});
