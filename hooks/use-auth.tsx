/**
 * Auth Context & Provider - hooks/use-auth.tsx
 *
 * Provides authentication state to the entire app via React Context.
 * Uses Supabase Auth with session persistence via AsyncStorage so the
 * user stays logged in across app restarts.
 *
 * Exports:
 *  - AuthProvider   -- wrap around root layout
 *  - useAuth()      -- consume auth state and actions
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import type { User } from '@/types/models';

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Fetch a profile from Supabase and map it to the User interface. */
async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) console.log('[fetchProfile] error:', JSON.stringify(error));
  if (!data) { console.log('[fetchProfile] no data for userId:', userId); return null; }
  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name,
    avatarUri: data.avatar_url,
    birthday: data.birthday,
    city: data.city,
    zipCode: data.zip_code,
    createdAt: data.created_at,
  };
}

/**
 * Fetch profile with retries — the DB trigger that creates the profile
 * row may not have completed by the time we first try to read it.
 */
async function fetchProfileWithRetry(userId: string, retries = 5): Promise<User | null> {
  for (let i = 0; i < retries; i++) {
    const profile = await fetchProfile(userId);
    if (profile) return profile;
    await new Promise(r => setTimeout(r, 500));
  }
  return null;
}

/**
 * Ensure a profile row exists — fetch it, and if missing, create a
 * minimal row so the app has something to display.
 */
async function ensureProfile(userId: string, username: string): Promise<User | null> {
  const profile = await fetchProfileWithRetry(userId, 3);
  if (profile) return profile;

  console.log('[auth] profile row missing, creating for:', username);
  const { error } = await supabase.from('profiles').upsert(
    { id: userId, username },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  if (error) console.log('[auth] profile upsert error:', JSON.stringify(error));

  return fetchProfile(userId);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on app launch
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const username = session.user.user_metadata?.username
          || session.user.email?.split('@')[0]
          || '';
        const profile = await ensureProfile(session.user.id, username);
        setUser(profile);
      }
      setLoading(false);
    }).catch((err) => {
      console.log('[auth] getSession error:', err);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('[auth] state change:', _event, session?.user?.id);
        if (session?.user) {
          const username = session.user.user_metadata?.username
            || session.user.email?.split('@')[0]
            || '';
          const profile = await ensureProfile(session.user.id, username);
          console.log('[auth] profile loaded:', profile?.username);
          if (profile) setUser(profile);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const email = `${username}@mobilegarage.app`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid username or password');
    if (data.user) {
      const profile = await ensureProfile(data.user.id, username);
      setUser(profile);
    }
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    const email = `${username}@mobilegarage.app`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Username is already taken');
      }
      throw error;
    }
    if (data.user) {
      const profile = await ensureProfile(data.user.id, username);
      setUser(profile);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      if (profile) setUser(profile);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    let avatarUrl = data.avatarUri || null;
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      avatarUrl = await uploadImage('avatars', `${session.user.id}/avatar`, avatarUrl);
    }

    const { error } = await supabase.from('profiles').update({
      display_name: data.displayName || null,
      avatar_url: avatarUrl,
      birthday: data.birthday || null,
      city: data.city || null,
      zip_code: data.zipCode || null,
    }).eq('id', session.user.id);

    if (error) throw error;
    await refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, signup, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
