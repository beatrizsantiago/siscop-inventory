import { render, screen, fireEvent } from '@testing-library/react';
import Add from '../../../src/App/Add';

jest.mock('../../../src/App/Add/components/Form', () => (props: any) => (
  <div data-testid="mock-form">
    Mocked Form
    <button onClick={props.handleClose}>Fechar</button>
  </div>
));

describe('Add component', () => {
  it('renders button and opens/closes dialog on click', () => {
    render(<Add />);

    const addButton = screen.getByRole('button', { name: /adicionar/i });
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(screen.getByText(/novo lançamento/i)).toBeInTheDocument();

    expect(screen.getByTestId('mock-form')).toBeInTheDocument();

    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);

    expect(screen.queryByText(/novo lançamento/i)).not.toBeInTheDocument();
  });
});
