import React, { useState } from 'react';
import {
  Box, Button, TextField, Grid,
  CircularProgress, Autocomplete,
  IconButton, FormControl, InputLabel,
  Select, MenuItem,
} from '@mui/material';
import { useInventoryContext } from '@App/context';
import { toast } from 'react-toastify';
import { TrashIcon } from '@phosphor-icons/react';
import { STATE_OPTIONS } from '@utils/stateList';
import { firebaseInventory } from '@fb/inventory';
import { firebaseKardex } from '@fb/kardex';
import AddInventoryUseCase from '@usecases/inventory/add';
import useGetFarms from '@hooks/useGetFarms';
import Farm from '@domain/entities/Farm';
import Inventory from '@domain/entities/Inventory';
import Product from '@domain/entities/Product';

type Props = {
  handleClose: () => void;
};

const FormContainer = ({ handleClose }:Props) => {
  const { dispatch } = useInventoryContext();

  const { farms, loading: farmsLoading } = useGetFarms();

  const [loading, setLoading] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [productsList, setProductsList] = useState<Inventory['items']>([{
    product: {
      id: '',
      name: '',
      unit_value: 0,
      cycle_days: 0,
    },
    amount: 0,
  }]);
  const [selectedState, setSelectedState] = useState('');

  const clearData = () => {
    setSelectedFarm(null);
    setProductsList([{
      product: {
        id: '',
        name: '',
        unit_value: 0,
        cycle_days: 0,
      },
      amount: 0,
    }]);
    setSelectedState('');
    setLoading(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (productsList.some((item) => item.product.id === '' || item.amount <= 0)) {
      toast.error('Todos os produtos devem ser selecionados e ter uma quantidade maior que zero.');
      return;
    }

    setLoading(true);

    try {
      const addInventoryUseCase = new AddInventoryUseCase(firebaseInventory, firebaseKardex);
      const response = await addInventoryUseCase.execute({
        farm: selectedFarm!,
        items: productsList,
        state: selectedState,
      });

      dispatch({
        type: 'ADD_INVENTORY',
        item: response,
      });

      toast.success('Estoque adicionado com sucesso!');
      clearData();
      handleClose();
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('INSUFFICIENT_STOCK')) {
        const productName = error.message.split(':')[1];
        toast.error(`Estoque insuficiente para o produto ${productName} na fazenda ${selectedFarm?.name}.`);
        return;
      }
      
      toast.error('Erro ao adicionar o estoque. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (index: number, product: Product | null) => {
    const updatedProductsList = [...productsList];

    if (!product) {
      updatedProductsList[index].product = {
        id: '',
        name: '',
        unit_value: 0,
        cycle_days: 0,
      };
      setProductsList(updatedProductsList);
      return;
    }

    updatedProductsList[index].product = product;
    setProductsList(updatedProductsList);
  };

  const handleAmountChange = (index: number, amount: number) => {
    const updatedProductsList = [...productsList];
    updatedProductsList[index].amount = amount;
    setProductsList(updatedProductsList);
  };

  const onAddProductClick = () => {
    setProductsList([
      ...productsList,
      {
        product: {
          id: '',
          name: '',
          unit_value: 0,
          cycle_days: 0,
        },
        amount: 0,
      },
    ]);
  };

  const onDeleteProductClick = (index: number) => {
    const updatedProductsList = productsList.filter((_, i) => i !== index);
    setProductsList(updatedProductsList);
  };

  const onCancelClick = () => {
    clearData();
    handleClose();
  };

  if (farmsLoading) return <CircularProgress />;

  const lastProduct = productsList[productsList.length - 1];
  const availableProductsList = selectedFarm
    ? selectedFarm.available_products.filter(
      (product) => !productsList.some((item) => item.product.id === product.id),
    ) : [];

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            value={selectedFarm}
            onChange={(_, newValue) => {
              setSelectedFarm(newValue);
            }}
            options={farms}
            renderInput={(params) => <TextField {...params} label="Selecione a fazenda" variant="standard" required />}
            getOptionLabel={(option) => option.name}
          />
        </Grid>

        {selectedFarm && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="state-select">Estado</InputLabel>
                <Select
                  labelId="state-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                >
                  {STATE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {productsList.map((item, index) => (
              <React.Fragment key={index}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    options={availableProductsList}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Selecione o produto"
                        variant="standard"
                        sx={{ mt: { xs: index === 0 ? 2 : 0, md: 0 } }}
                        required
                      />
                    )}
                    getOptionLabel={(option) => option.name}
                    value={item.product}
                    onChange={(_, newValue) => handleSelectProduct(index, newValue)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    label="Quantidade"
                    variant="standard"
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => handleAmountChange(index, Number(e.target.value))}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Box display={{ xs: 'flex', md: 'none' }} justifyContent="center">
                    <Button
                      color="error"
                      onClick={() => onDeleteProductClick(index)}
                      disabled={productsList.length <= 1}
                      variant="outlined"
                    >
                      Excluir item
                    </Button>
                  </Box>
                  <Box display={{ xs: 'none', md: 'flex' }} alignItems="flex-end" justifyContent="center" height="100%">
                    <IconButton
                      sx={{ color: 'error.main' }}
                      onClick={() => onDeleteProductClick(index)}
                      disabled={productsList.length <= 1}
                    >
                      <TrashIcon size={20} />
                    </IconButton>
                  </Box>
                </Grid>
              </React.Fragment>
            ))}

            {productsList.length < selectedFarm.available_products.length && (
              <Grid size={12}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={lastProduct && (lastProduct.product.id === '' || lastProduct.amount <= 0)}
                    loading={loading}
                    loadingPosition="start"
                    onClick={onAddProductClick}
                  >
                    Adicionar produto
                  </Button>
                </Box>
              </Grid>
            )}
          </>
        )}
      </Grid>

      <Box marginTop={4} display="flex" justifyContent="space-between">
        <Button onClick={onCancelClick} variant="outlined" color="error">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
          loadingPosition="start"
        >
          Salvar
        </Button>
      </Box>
    </form>
  );
}

export default FormContainer;
