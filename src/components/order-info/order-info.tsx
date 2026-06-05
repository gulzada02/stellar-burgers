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

import { ingredientsSelector } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const isModal = Boolean(location.state?.background);

  const order = useSelector(orderSelector);
  const isLoading = useSelector(isLoadingSelector);
  const ingredients = useSelector(ingredientsSelector);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, id: string) => {
        const ingredient = ingredients.find((i) => i._id === id);
        if (!ingredient) return acc;

        if (!acc[id]) {
          acc[id] = {
            ...ingredient,
            count: 1
          };
        } else {
          acc[id].count += 1;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
