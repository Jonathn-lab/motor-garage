/**
 * Login / Sign-Up Screen - app/(auth)/login.tsx
 *
 * Single screen with a toggle between "Log In" and "Sign Up" modes.
 * Uses the existing TextInputField component and app theming.
 * Validates inputs and displays errors for invalid credentials or
 * duplicate usernames.
 */

import { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { TextInputField } from '@/components/text-input-field';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const bg = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const accent = useThemeColor({}, 'accent');
  const textSecondary = useThemeColor({}, 'textSecondary');

  function validate() {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (isSignUp) {
      if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
      else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      if (isSignUp) {
        await signup(username.trim(), password);
      } else {
        await login(username.trim(), password);
      }
      router.replace('/garage');
    } catch (e: any) {
      setErrors({ form: e.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsSignUp((prev) => !prev);
    setErrors({});
    setConfirmPassword('');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ThemedText type="title">MobileGarage</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: cardBorder }]}>
          {errors.form ? (
            <View style={styles.errorBanner}>
              <ThemedText style={styles.errorBannerText}>{errors.form}</ThemedText>
            </View>
          ) : null}

          <TextInputField
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.username}
          />

          <TextInputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          {isSignUp ? (
            <TextInputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword}
            />
          ) : null}

          <Pressable
            style={[styles.submitButton, { backgroundColor: accent, opacity: loading ? 0.6 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <ThemedText style={styles.submitButtonText}>
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
            </ThemedText>
          </Pressable>
        </View>

        <Pressable style={styles.toggleRow} onPress={toggleMode}>
          <ThemedText style={{ color: textSecondary }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </ThemedText>
          <ThemedText style={{ color: accent, fontWeight: '600' }}>
            {isSignUp ? 'Log In' : 'Sign Up'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
