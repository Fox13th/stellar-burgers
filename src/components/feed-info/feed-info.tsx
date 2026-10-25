import {
  feedOrdersSelector,
  feedTotalSelector,
  feedTotalTodaySelector,
} from '@/services/feedSlice';
import { FeedInfoUI } from '@ui';

import { useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders: TOrder[] = useSelector(feedOrdersSelector);
  const total = useSelector(feedTotalSelector);
  const totalToday = useSelector(feedTotalTodaySelector);

  const feed = {
    orders,
    total,
    totalToday,
    isLoading: false,
    error: null,
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
