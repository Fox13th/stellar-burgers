import { registerUser } from '@/services/userSlice';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(
      registerUser({
        name: userName,
        email,
        password,
      })
    )
      .unwrap()
      .then(() => {
        void navigate('/profile', { replace: true });
      });
  };

  return (
    <RegisterUI
      errorText=""
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
