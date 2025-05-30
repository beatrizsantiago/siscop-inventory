import { State, ActionType } from './types';

const reducer = (state: State, action: ActionType):State => {
  switch (action.type) {
    case 'SET_INVENTORY':
      return {
        ...state,
        list: action.list,
        loading: false,
      };

    case 'ADD_INVENTORY':
      return {
        ...state,
        list: [action.item, ...state.list],
      };

    default:
      throw new Error('Unhandled action');
  }
};

export default reducer;
