'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isLoggedIn, login } from '@/store/loginSlice';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function LoginPage() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? '';
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userIsLoggedIn = useAppSelector(isLoggedIn);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<LoginFormInputs>();
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await fetch(`${serverUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const json = await response.json();
        const token = json.token;

        dispatch(login(token));
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (userIsLoggedIn) {
    router.push('/profile');
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <h1 className="text-4xl font-bold">Login</h1>
      <form
        className="flex flex-col items-center space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Email"
          {...register('username', { required: true })}
        />
        <input
          className="p-2 border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded"
          type="submit"
          disabled={isLoading}
        >
          Login
        </button>
      </form>
      <a href="/register" className="text-blue-500">
        Go to register page
      </a>
    </main>
  );
}
