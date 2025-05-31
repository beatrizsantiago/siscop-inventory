import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};
