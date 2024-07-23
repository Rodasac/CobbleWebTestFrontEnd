'use client';

import EmblaCarousel from '@/components/carousel/EmblaCarousel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, selectToken } from '@/store/loginSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? '';
  const router = useRouter();
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
    avatar: string;
    photos: {
      name: string;
      url: string;
    }[];
  } | null>(null);

  useEffect(() => {
    fetch(`${serverUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error(error));
  }, [token, serverUrl]);

  if (!token) {
    router.push('/login');
  }

  if (!profile) {
    return <main>Loading...</main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <h1 className="text-4xl font-bold">Profile</h1>
      <p>First Name: {profile?.firstName}</p>
      <p>Last Name: {profile?.lastName}</p>
      <Image
        className="rounded-full"
        src={profile?.avatar ?? ''}
        width={100}
        height={100}
        alt="Avatar"
      />
      <p>Photos:</p>
      <EmblaCarousel slides={profile?.photos ?? []} />
      <button className="text-blue-500" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </main>
  );
}
