'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppSelector } from '@/store/hooks';
import { isLoggedIn } from '@/store/loginSlice';

interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photos: FileList;
}

export default function RegisterPage() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? '';
  const router = useRouter();
  const userIsLoggedIn = useAppSelector(isLoggedIn);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<RegisterFormInputs>();
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    const body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      photos: {
        name: string;
        url: string;
      }[];
    } = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      photos: [],
    };

    for (const photo of Array.from(data.photos)) {
      body.photos.push({
        name: photo.name,
        // convert the File object to a data URL
        url: await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo);
        }),
      });
    }

    try {
      const response = await fetch(`${serverUrl}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        router.push('/login');
      } else {
        if (response.status === 400) {
          const json = await response.json();
          setError(json.error);
        }
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
      <h1 className="text-4xl font-bold">Register</h1>
      <form
        className="flex flex-col items-center space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="p-2 border border-gray-300 rounded"
          type="text"
          placeholder="First Name"
          {...register('firstName', {
            required: 'First name is required',
            minLength: 2,
            maxLength: 25,
          })}
        />
        {errors.firstName && (
          <span className="text-red-400">{errors.firstName.message}</span>
        )}
        <input
          className="p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Last Name"
          {...register('lastName', {
            required: 'Last name is required',
            minLength: 2,
            maxLength: 25,
          })}
        />
        {errors.lastName && (
          <span className="text-red-400">{errors.lastName.message}</span>
        )}
        <input
          className="p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: /^\S+@\S+$/i,
          })}
        />
        {errors.email && (
          <span className="text-red-400">{errors.email.message}</span>
        )}
        <input
          className="p-2 border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          {...register('password', {
            required: 'Password is required',
            // pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])\w{6,50 }$/,
          })}
        />
        {errors.password && (
          <span className="text-red-400">{errors.password.message}</span>
        )}
        <label className="flex items-center space-x-2">
          <span>Photos:</span>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register('photos', {
              required: true,
              min: 4,
              validate: (photos) => {
                if (photos.length < 4) {
                  return 'At least 4 photos are required';
                }
                for (const photo of Array.from(photos)) {
                  if (!photo.type.startsWith('image/')) {
                    return 'Only images are allowed';
                  }
                }

                return true;
              },
            })}
          />
        </label>
        {errors.photos && (
          <span className="text-red-400">
            {errors.photos.message || 'At least 4 photos are required'}
          </span>
        )}
        <button
          className="p-2 bg-blue-500 text-white rounded"
          type="submit"
          disabled={isLoading}
        >
          Register
        </button>
      </form>
      <a href="/login" className="text-blue-500">
        Go to login page
      </a>
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}
