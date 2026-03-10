/**
 * useColorScheme Hook - hooks/use-color-scheme.ts
 *
 * A thin re-export of React Native's built-in useColorScheme hook.
 * This indirection exists so the app can swap in a custom implementation
 * (e.g. for user-overridable theme preferences) without touching every
 * import site.
 */
export { useColorScheme } from 'react-native';
