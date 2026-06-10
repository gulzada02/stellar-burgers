import constructorReducer, { constructorActions } from '../constructorSlice';
import { TIngredient } from '@utils-types';

describe('burgerConstructor slice reducer', () => {
  const initialState = {
    bun: null as any,
    ingredients: [] as any[]
  };

  const bun: TIngredient = {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 100,
    price: 200,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const main: TIngredient = {
    _id: 'main-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 50,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  it('returns initial state for unknown action', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('adds bun ingredient correctly', () => {
    const nextState = constructorReducer(initialState, constructorActions.addIngredient(bun));

    expect(nextState.bun).toMatchObject({
      _id: 'bun-1',
      type: 'bun',
      name: 'Тестовая булка',
      price: 200
    });
    expect(nextState.ingredients).toHaveLength(0);
    expect(nextState.bun?.id).toBeDefined();
  });

  it('adds main ingredient correctly', () => {
    const nextState = constructorReducer(initialState, constructorActions.addIngredient(main));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toMatchObject({
      _id: 'main-1',
      type: 'main',
      name: 'Тестовая начинка',
      price: 100
    });
    expect(nextState.ingredients[0].id).toBeDefined();
  });

  it('deletes item by id', () => {
    const filledState = constructorReducer(initialState, constructorActions.addIngredient(main));
    const itemId = filledState.ingredients[0].id;
    const nextState = constructorReducer(filledState, constructorActions.deleteItem(itemId));

    expect(nextState.ingredients).toHaveLength(0);
  });

  it('moves ingredients up and down', () => {
    const first = constructorReducer(initialState, constructorActions.addIngredient(main));
    const second = constructorReducer(first, constructorActions.addIngredient({
      ...main,
      _id: 'main-2',
      name: 'Тестовая начинка 2'
    }));

    const moved = constructorReducer(second, constructorActions.moveItem({ index: 1, placeToMove: 'up' }));

    expect(moved.ingredients[0]._id).toBe('main-2');
    expect(moved.ingredients[1]._id).toBe('main-1');
  });

  it('clears constructor state', () => {
    const stateWithBun = constructorReducer(initialState, constructorActions.addIngredient(bun));
    const stateWithIngredient = constructorReducer(stateWithBun, constructorActions.addIngredient(main));
    const nextState = constructorReducer(stateWithIngredient, constructorActions.clearConstructor());

    expect(nextState).toEqual(initialState);
  });
});
