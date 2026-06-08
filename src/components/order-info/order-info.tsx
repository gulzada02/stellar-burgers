import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderByNumber,
  orderSelector,
  isLoadingSelector
} from '../../services/slices/orderSlice';
import { ordersFeedsSelector } from '../../services/slices/feedSlice';
import { profileOrdersSelector } from '../../services/slices/profileOrdersSlice';
import { ingredientsSelector } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const isModal = !!location.state?.background;

  const ordersFromFeed = useSelector(ordersFeedsSelector);
  const ordersFromProfile = useSelector(profileOrdersSelector);
  const orderFromAPI = useSelector(orderSelector);
  const isOrderLoading = useSelector(isLoadingSelector);
  const ingredients = useSelector(ingredientsSelector);

  const orderData = isModal
    ? ordersFromFeed.find(
        (order: { number: { toString: () => string | undefined } }) =>
          order.number.toString() === number
      ) ||
      ordersFromProfile.find(
        (order: { number: { toString: () => string | undefined } }) =>
          order.number.toString() === number
      )
    : orderFromAPI;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string | number) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: { _id: string | number }) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = (
      Object.values(ingredientsInfo) as (TIngredient & { count: number })[]
    ).reduce((acc, item) => acc + item.price * item.count, 0);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  useEffect(() => {
    if (number && !isModal) {
      const orderNumber = Number(number);
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, number, isModal]);

  if (isOrderLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
