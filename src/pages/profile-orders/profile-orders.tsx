import { getOrders, userOrdersSelector } from '@/services/userSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(userOrdersSelector);

  useEffect(() => {
    void dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
