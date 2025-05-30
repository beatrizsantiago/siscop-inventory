import Add from '@App/Add';
import List from '@App/List';
import { Box } from '@mui/material';

const Main = () => {
  return (
    <Box padding={2}>
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Add />
      </Box>
      <List />
    </Box>
  );
};

export default Main;
