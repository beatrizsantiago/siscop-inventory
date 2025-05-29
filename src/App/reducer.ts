import { State, ActionType } from './types';

const reducer = (state: State, action: ActionType):State => {
  switch (action.type) {
    case 'SET_INVENTORY':
      return {
        ...state,
        list: action.list,
        loading: false,
      };

    default:
      throw new Error('Unhandled action');
  }
};

export default reducer;
