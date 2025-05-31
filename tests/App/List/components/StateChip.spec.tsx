import StateChip from '../../../../src/App/List/components/StateChip';
import { screen } from '@testing-library/react';
import { STATE_LABELS } from '../../../../src/utils/stateList';
import { renderWithTheme } from '../../../__mocks__/renderWithTheme';

describe('StateChip from list component', () => {
  it('renders the correct label and style for WAITING', () => {
    renderWithTheme(<StateChip state="WAITING" />);
    const chip = screen.getByText(STATE_LABELS.WAITING);
    expect(chip).toBeInTheDocument();
  });

  it('renders the correct label and style for IN_PRODUCTION', () => {
    renderWithTheme(<StateChip state="IN_PRODUCTION" />);
    const chip = screen.getByText(STATE_LABELS.IN_PRODUCTION);
    expect(chip).toBeInTheDocument();
  });

  it('renders the correct label and style for READY', () => {
    renderWithTheme(<StateChip state="READY" />);
    const chip = screen.getByText(STATE_LABELS.READY);
    expect(chip).toBeInTheDocument();
  });
});
