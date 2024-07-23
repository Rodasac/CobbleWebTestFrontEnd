import { redirect, useRouter } from 'next/navigation';

export default function Home() {
  redirect('/login');
}
