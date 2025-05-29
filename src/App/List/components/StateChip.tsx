import { Chip } from '@mui/material';
import { STATE_LABELS } from '@utils/stateList';

type Props = {
  state: string,
};

const STATE_COLORS: { [key: string]: string } = {
  WAITING: 'tertiary.main',
  IN_PRODUCTION: 'blue.main',
  READY: 'secondary.light',
};

const StateChip = ({ state }:Props) => (
  <Chip
    label={STATE_LABELS[state]}
    sx={{
      backgroundColor: STATE_COLORS[state],
      fontWeight: 'bold',
    }}
  />
);

export default StateChip;
