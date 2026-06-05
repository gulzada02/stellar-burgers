import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (!action.payload) return;

      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },

    deleteItem: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item: { id: string }) => item.id !== action.payload
      );
    },

    moveItem: (
      state,
      action: PayloadAction<{ index: number; placeToMove: 'up' | 'down' }>
    ) => {
      const { index, placeToMove } = action.payload;

      if (placeToMove === 'up' && index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }

      if (placeToMove === 'down' && index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const constructorActions = constructorSlice.actions;
export const constructorSelector = (state: RootState) => state.constructorSlice;
export const constructorBunSelector = (state: RootState) =>
  state.constructorSlice.bun;

export default constructorSlice.reducer;
