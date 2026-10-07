import { constructorSelector, clear } from '@/services/constructorSlice';
import {
  orderSelector,
  isOrderLoadingSelector,
  removeOrder,
  postOrder,
} from '@/services/orderSlice';
import { userDataSelector } from '@/services/userSlice';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems: TConstructorState = useSelector(constructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData: TOrder | null = useSelector(orderSelector);
  const isUserAuth = useSelector(userDataSelector);

  const onOrderClick = (): void => {
    if (!isUserAuth) {
      void navigate('/login', { replace: true });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ
    const { bun, ingredients } = constructorItems;
    const orderData: string[] = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id,
    ];
    void dispatch(postOrder(orderData));
  };

  const closeOrderModal = (): void => {
    void navigate('/', { replace: true });
    void dispatch(removeOrder());
    void dispatch(clear());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
