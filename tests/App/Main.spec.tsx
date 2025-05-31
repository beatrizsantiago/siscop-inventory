import { render, screen } from '@testing-library/react';
import Main from '../../src/App/Main';
import '@testing-library/jest-dom';

jest.mock('@App/Add', () => () => <div data-testid="add-component">Add</div>);
jest.mock('@App/List', () => () => <div data-testid="list-component">List</div>);

describe('Main component', () => {
  it('renders Add and List components', () => {
    render(<Main />);

    expect(screen.getByTestId('add-component')).toBeInTheDocument();
    expect(screen.getByTestId('list-component')).toBeInTheDocument();
  });
});
