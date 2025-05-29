import {
  useContext, createContext, useMemo, useReducer,
  useRef, useEffect, useCallback,
} from 'react';
import { firebaseInventory } from '@fb/inventory';
import { toast } from 'react-toastify';
import GetInventoryUseCase from '@usecases/inventory/getAll';

import { InventoryProviderProps, InventoryProviderType, State } from './types';
import reducer from './reducer';

const initialState:State = {
  list: [],
  loading: true,
};

const Context = createContext({} as InventoryProviderType);
const useInventoryContext = ():InventoryProviderType => useContext(Context);

const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getInventory = useCallback(async () => {
    try {
      const getUserCase = new GetInventoryUseCase(firebaseInventory);
      const list = await getUserCase.execute();
      
      dispatch({
        type: 'SET_INVENTORY',
        list,
      });
    } catch {
      toast.error('Erro ao carregar o estoque. Tente novamente mais tarde.');
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getInventory();
    }
  }, [getInventory]);

  const value = useMemo(() => ({
    state,
    dispatch,
  }), [state]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { InventoryProvider, useInventoryContext };
