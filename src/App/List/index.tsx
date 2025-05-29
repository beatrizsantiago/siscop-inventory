import { Box, Paper, Typography } from '@mui/material';
import { useInventoryContext } from '@App/context';
import { formatDate } from 'date-fns';

import StateChip from './components/StateChip';

const List = () => {
  const { state } = useInventoryContext();

  return (
    <Box>
      {state.list.map((item) => (
        <Paper key={item.id} elevation={0}>
          <Box p={2} borderRadius={3} mt={2} display="flex" alignItems="center" justifyContent="space-between">
            <Typography>
              {item.farm_name}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection={{ xs: 'column', sm: 'row' }}
              marginLeft={2}
            >
              <StateChip state={item.state} />
              <Typography
                variant="caption"
                color="textSecondary"
                marginLeft={{ xs: 0, sm: 2 }}
                marginTop={{ xs: 1, sm: 0 }}
              >
                {formatDate(item.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default List;
