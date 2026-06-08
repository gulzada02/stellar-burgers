import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredients slice reducer', () => {
  const initialState = {
    ingredients: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  };

  it('returns initial state for unknown action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('handles getIngredients.pending', () => {
    const nextState = ingredientsReducer(
      initialState,
      getIngredients.pending('requestId', undefined)
    );

    expect(nextState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('handles getIngredients.fulfilled', () => {
    const payload: TIngredient[] = [
      {
        _id: 'bun-1',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 100,
        price: 200,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];

    const nextState = ingredientsReducer(
      initialState,
      getIngredients.fulfilled(payload, 'requestId', undefined)
    );

    expect(nextState).toEqual({
      ...initialState,
      isLoading: false,
      ingredients: payload
    });
  });

  it('handles getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Network error' }
    } as const;

    const nextState = ingredientsReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Network error'
    });
  });
});
