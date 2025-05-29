import React, { useState } from 'react';
import { Box, Paper, Typography, Collapse, Divider, Grid } from '@mui/material';
import { formatDate } from 'date-fns';

import StateChip from './StateChip';
import Inventory from '@domain/entities/Inventory';

type Props = {
  item: Inventory,
};

const InventoryItem = ({ item }:Props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Paper 
      elevation={0}
      sx={{ borderRadius: 3, cursor: 'pointer' }}
      onClick={() => setShowDetails(!showDetails)}
    >
      <Box p={2} mt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography fontWeight={600}>
            {item.farm.name}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
          >

            {formatDate(item.created_at, "dd/MM/yyyy 'às' HH:mm'h'")}
          </Typography>
        </Box>
        <StateChip state={item.state} />
      </Box>
      
      <Collapse in={showDetails} unmountOnExit>
        <Box px={2} pb={2}>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 4, md: 6}}>
              <Typography variant="caption" color="textSecondary" fontWeight={600}>
                Nome
              </Typography>
            </Grid>
            <Grid size={{ xs: 4, md: 3}}>
              <Typography variant="caption" color="textSecondary" fontWeight={600}>
                Quantidade
              </Typography>
            </Grid>
            <Grid size={{ xs: 4, md: 3}}>
              <Typography variant="caption" color="textSecondary" fontWeight={600}>
                Ciclo
              </Typography>
            </Grid>

            {item.items.map((inventoryItem, index) => (
              <React.Fragment key={index}>
                <Grid size={{ xs: 4, md: 6}}>
                  <Typography variant="body2" fontWeight={600}>
                    {inventoryItem.product.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4, md: 3}}>
                  <Typography variant="body2" fontWeight={600}>
                    {inventoryItem.amount}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4, md: 3}}>
                  <Typography variant="body2" fontWeight={600}>
                    {inventoryItem.product.cycle_days}
                    {' '}
                    dias
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default InventoryItem;
