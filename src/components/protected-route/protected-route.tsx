import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router';

import { useSelector } from '../../services/store';
import { isAuthCheckedSelector, userDataSelector } from '../../services/userSlice';

type TLocationState = {
  from?: Location;
};

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);

  const location = useLocation();
  const state = location.state as TLocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = state?.from ?? { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
