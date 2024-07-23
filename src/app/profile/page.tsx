'use client';

import { useAppSelector } from '@/store/hooks';
import { selectToken } from '@/store/loginSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? '';
  const router = useRouter();
  const token = useAppSelector(selectToken);
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
    return router.push('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <h1 className="text-4xl font-bold">Profile</h1>
      <p>First Name: {profile?.firstName}</p>
      <p>Last Name: {profile?.lastName}</p>
      <Image
        src={profile?.avatar ?? ''}
        width={200}
        height={200}
        alt="Avatar"
      />
      <p>Photos:</p>
      <ul className="grid grid-cols-3 gap-4">
        {profile?.photos.map((photo) => (
          <li key={photo.url}>
            <Image src={photo.url} width={200} height={200} alt={photo.name} />
          </li>
        ))}
      </ul>
      <a href="/logout" className="text-blue-500">
        Logout
      </a>
    </main>
  );
}
