import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  register,
  clearError,
  errorAuthSelector
} from '../../services/slices/authSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const errorText = useSelector(errorAuthSelector) || undefined;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearError());
    dispatch(register({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText={errorText}
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
