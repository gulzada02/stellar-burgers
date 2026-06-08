import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  login,
  clearError,
  errorAuthSelector
} from '../../services/slices/authSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const errorText = useSelector(errorAuthSelector) || undefined;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearError());
    dispatch(login({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
