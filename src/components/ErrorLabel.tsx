import { Typography } from '@mui/material';

const ErrorLabel = ({ error }: { error: string }) => (
  <Typography variant="caption" color="error">
    {error}
  </Typography>
);

export default ErrorLabel;
