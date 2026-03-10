/**
 * Profile Screen - app/(tabs)/profile.tsx
 *
 * Displays and edits the current user's profile: avatar, display name,
 * birthday, city, and zip code. Includes a logout button.
 * Car community vibe — "The Driver" behind the builds.
 */

import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { TextInputField } from '@/components/text-input-field';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/hooks/use-auth';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [birthday, setBirthday] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const bg = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');
  const accent = useThemeColor({}, 'accent');
  const danger = useThemeColor({}, 'danger');
  const secondaryText = useThemeColor({}, 'textSecondary');

  /* Sync form state from user data */
  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || '');
    setAvatarUri(user.avatarUri || null);
    setBirthday(user.birthday || '');
    setCity(user.city || '');
    setZipCode(user.zipCode || '');
  }, [user]);

  async function pickAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({
        displayName: displayName.trim() || null,
        avatarUri,
        birthday: birthday.trim() || null,
        city: city.trim() || null,
        zipCode: zipCode.trim() || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    router.replace('/(auth)/login' as Href);
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
        <View style={[styles.content, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
          <ThemedText>Loading profile…</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <ThemedText style={styles.screenTitle}>The Driver</ThemedText>

          {/* Avatar + username card */}
          <View style={[styles.avatarCard, { backgroundColor: card, borderColor: cardBorder }]}>
            <Pressable onPress={pickAvatar} style={styles.avatarWrap}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                  <IconSymbol name="person.circle.fill" size={56} color={accent} />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <IconSymbol name="camera.fill" size={14} color="#FFFFFF" />
              </View>
            </Pressable>

            <ThemedText style={styles.username}>@{user.username}</ThemedText>
            <ThemedText style={[styles.memberSince, { color: secondaryText }]}>
              Member since {memberSince}
            </ThemedText>
          </View>

          {/* Editable fields */}
          <View style={[styles.fieldCard, { backgroundColor: card, borderColor: cardBorder }]}>
            <ThemedText style={styles.sectionTitle}>Profile Info</ThemedText>

            <TextInputField
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="What do people call you?"
              autoCapitalize="words"
            />

            <TextInputField
              label="Birthday"
              value={birthday}
              onChangeText={setBirthday}
              placeholder="MM/DD/YYYY"
              keyboardType="numbers-and-punctuation"
            />

            <View style={styles.row}>
              <View style={styles.flex}>
                <TextInputField
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  placeholder="Your city"
                  autoCapitalize="words"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={styles.zipWrap}>
                <TextInputField
                  label="Zip Code"
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="90210"
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={[styles.saveBtn, { backgroundColor: accent, opacity: saving ? 0.6 : 1 }]}
            >
              <ThemedText style={styles.saveBtnText}>
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Logout */}
          <Pressable onPress={handleLogout} style={[styles.logoutBtn, { borderColor: danger }]}>
            <ThemedText style={[styles.logoutText, { color: danger }]}>Log Out</ThemedText>
          </Pressable>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    padding: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
  },
  avatarCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
  },
  memberSince: {
    fontSize: 13,
    marginTop: 4,
  },
  fieldCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  zipWrap: {
    width: 100,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
