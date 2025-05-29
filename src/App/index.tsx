import { theme } from 'agro-core';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { InventoryProvider } from './context';
import Main from './Main';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
      <InventoryProvider>
        <Main />
      </InventoryProvider>
    <ToastContainer />
  </ThemeProvider>
);

export default App;
