import { userDataSelector } from '@/services/userSlice';
import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector(userDataSelector);

  return <AppHeaderUI userName={userName?.name} />;
};
