'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import config from '../config';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signin = async () => {
    try {
      const payload = {
        username: username,
        password: password,
      };
      const res = await axios.post(
        config.apiServer + '/api/user/signIn',
        payload,
      );

      if (res.data.token !== undefined) {
        localStorage.setItem(config.token, res.data.token);
      } else {
        Swal.fire({
          title: 'Username!!',
          text: 'Username No',
          icon: 'error',
        });
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        signin={signin}
      />
    </div>
  );
};

export default SignInPage;
