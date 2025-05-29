import { Box } from '@mui/material';
import { useInventoryContext } from '@App/context';

import InventoryItem from './components/InventoryItem';

const List = () => {
  const { state } = useInventoryContext();

  return (
    <Box>
      {state.list.map((item) => (
        <InventoryItem key={item.id} item={item} />
      ))}
    </Box>
  );
}

export default List;
