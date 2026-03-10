/**
 * Index Redirect - app/index.tsx
 *
 * The root index route. Redirects to login if not authenticated,
 * or to the garage if the user is already logged in.
 */

import { Redirect, type Href } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function Index() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  if (isLoggedIn) {
    return <Redirect href="/garage" />;
  }

  return <Redirect href={'/(auth)/login' as Href} />;
}
