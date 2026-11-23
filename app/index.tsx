import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { colors } from '../src/theme';
import { getToken } from '../src/session';

/** Entry route: a stored session opens the home screen, which validates it with the API. */
export default function Index() {
  const [target, setTarget] = useState<'/home' | '/login' | null>(null);

  useEffect(() => {
    getToken().then((token) => setTarget(token ? '/home' : '/login'), () => setTarget('/login'));
  }, []);

  if (!target) return <View style={styles.page}><ActivityIndicator color={colors.accentBlue} /></View>;
  return <Redirect href={target} />;
}

const styles = StyleSheet.create({
  page: { alignItems: 'center', backgroundColor: colors.app, flex: 1, justifyContent: 'center' },
});
