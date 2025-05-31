import { Box, Button, CircularProgress } from '@mui/material';
import { useInventoryContext } from '@App/context';

import InventoryItem from './components/InventoryItem';

const List = () => {
  const { state, getMoreInventory } = useInventoryContext();

  return (
    <Box>
      {state.list.map((item) => (
        <InventoryItem key={item.id} item={item} />
      ))}

      {state.loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {state.hasMore && !state.loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={getMoreInventory}>
            Carregar mais
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default List;
