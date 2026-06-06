import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feeds/getFeeds', async (_, thunkApi) => {
  try {
    return await getFeedsApi();
  } catch (err) {
    return thunkApi.rejectWithValue('Ошибка загрузки ленты заказов');
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFeeds.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки ленты';
      });
  }
});

export const ordersFeedsSelector = (state: RootState) => state.feeds.orders;
export const totalSelector = (state: RootState) => state.feeds.total;
export const totalTodaySelector = (state: RootState) => state.feeds.totalToday;
export const isLoadingSelector = (state: RootState) => state.feeds.isLoading;
export const errorSelector = (state: RootState) => state.feeds.error;
export default feedsSlice.reducer;
