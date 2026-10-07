import { loginUser } from '@/services/userSlice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(
      loginUser({
        email,
        password,
      })
    )
      .unwrap()
      .then(() => navigate('/profile', { replace: true }));
  };

  return (
    <LoginUI
      errorText=""
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
