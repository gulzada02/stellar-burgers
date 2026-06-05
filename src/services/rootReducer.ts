import { combineReducers } from '@reduxjs/toolkit';

import ingredients from './slices/ingredientsSlice';
import feeds from './slices/feedSlice';
import constructor from './slices/constructorSlice';
import order from './slices/orderSlice';
import auth from './slices/authSlice';
import profileOrders from './slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  ingredients,
  feeds,
  constructor,
  order,
  auth,
  profileOrders
});
