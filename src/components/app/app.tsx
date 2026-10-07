import { getUser } from '@/services/userSlice';
import {
  AppHeader,
  ProtectedRoute,
  Modal,
  OrderInfo,
  IngredientDetails,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import {
  getIngredients,
  isIngredientLoadingSelector,
  ingredientSelector,
  ingredientErrorSelector,
} from '../../services/ingridientSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

type TLocation = {
  background?: Location;
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients = useSelector(ingredientSelector);
  const isIngredientsLoading = useSelector(isIngredientLoadingSelector);
  const ingredientsError = useSelector(ingredientErrorSelector);

  useEffect(() => {
    void dispatch(getIngredients());
    void dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as TLocation | null;
  const backgroundLocation = locationState?.background;

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal
                title={'Информация о заказе'}
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                title={'Информация об ингридиенте'}
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <Modal
                title={'Информация о заказе'}
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
