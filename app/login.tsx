import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '../src/api';
import { BrandMark } from '../src/brandMark';
import { colors, radius, typography } from '../src/theme';
import { saveToken } from '../src/session';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(''); setBusy(true);
    try {
      const result = await api.login(username.trim(), password);
      await saveToken(result.token);
      router.replace('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to connect.');
    } finally { setBusy(false); }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <BrandMark size={46} />
          <View><Text style={styles.brand}>S-Aloha</Text><Text style={styles.brandSub}>ITIL Platform</Text></View>
        </View>
        <View style={styles.intro}>
          <Text style={styles.kicker}>ITIL PLATFORM FOR IT</Text>
          <Text style={styles.title}>Manage IT service, from incidents to improvement.</Text>
          <View style={styles.motto}><Text style={styles.mottoMg}>« Service alohan’ny zavatra rehetra »</Text><Text style={styles.mottoEn}>Service comes before everything else.</Text></View>
        </View>
        <View style={styles.card}>
          <Text style={styles.formTitle}>Sign in</Text>
          <Text style={styles.formSubtitle}>With your Active Directory account.</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setUsername} placeholder="first.last" placeholderTextColor={colors.tertiary} style={styles.input} value={username} returnKeyType="next" />
          <Text style={styles.label}>Password</Text>
          <TextInput onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.tertiary} secureTextEntry style={styles.input} value={password} onSubmitEditing={submit} returnKeyType="go" />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" disabled={busy || !username || !password} onPress={submit} style={({ pressed }) => [styles.button, (busy || !username || !password) && styles.disabled, pressed && styles.pressed]}>
            {busy ? <ActivityIndicator color={colors.nav} /> : <Text style={styles.buttonText}>Sign in</Text>}
          </Pressable>
          <Text style={styles.source}>Source code · AGPLv3</Text>
        </View>
        <Text style={styles.footer}>Your credentials are verified by your organization’s directory.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.app },
  page: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 28 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 12, marginBottom: 34 },
  brand: { color: colors.text, fontFamily: typography.display, fontSize: 22, fontWeight: '600', letterSpacing: 0.2 },
  brandSub: { color: colors.tertiary, fontFamily: typography.body, fontSize: 12, marginTop: 3 },
  intro: { marginBottom: 24 },
  kicker: { color: colors.accentTeal, fontFamily: typography.body, fontSize: 11, fontWeight: '700', letterSpacing: 1.4, marginBottom: 10 },
  title: { color: colors.text, fontFamily: typography.display, fontSize: 27, fontWeight: '500', lineHeight: 35, letterSpacing: -0.5 },
  motto: { borderLeftColor: colors.accentTeal, borderLeftWidth: 2, marginTop: 18, paddingLeft: 12 },
  mottoMg: { color: colors.text, fontFamily: typography.body, fontSize: 14, fontStyle: 'italic' },
  mottoEn: { color: colors.secondary, fontFamily: typography.body, fontSize: 12, marginTop: 3 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.panel, borderWidth: 1, padding: 22 },
  formTitle: { color: colors.text, fontFamily: typography.display, fontSize: 20, fontWeight: '500' },
  formSubtitle: { color: colors.secondary, fontFamily: typography.body, fontSize: 13, marginBottom: 18, marginTop: 5 },
  label: { color: colors.secondary, fontFamily: typography.body, fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.app, borderColor: colors.borderStrong, borderRadius: radius.control, borderWidth: 1, color: colors.text, fontFamily: typography.body, fontSize: 15, paddingHorizontal: 12, paddingVertical: 11 },
  button: { alignItems: 'center', backgroundColor: colors.accentBlue, borderColor: colors.accentBlue, borderRadius: radius.control, borderWidth: 1, justifyContent: 'center', marginTop: 20, minHeight: 44 },
  buttonText: { color: '#04101f', fontFamily: typography.body, fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.5 }, pressed: { opacity: 0.8 },
  error: { backgroundColor: colors.accentRedSoft, borderColor: colors.accentRed, borderLeftWidth: 3, borderRadius: radius.control, color: colors.text, fontFamily: typography.body, fontSize: 13, marginTop: 12, padding: 10 },
  source: { color: colors.tertiary, fontFamily: typography.body, fontSize: 12, marginTop: 18, textAlign: 'center' },
  footer: { color: colors.tertiary, fontFamily: typography.body, fontSize: 12, lineHeight: 18, marginTop: 20, textAlign: 'center' },
});
