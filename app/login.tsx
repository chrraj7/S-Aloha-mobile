import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '../src/api';
import { saveToken } from '../src/session';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError('');
    setBusy(true);
    try {
      const result = await api.login(username.trim(), password);
      await saveToken(result.token);
      router.replace('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.brand}><Text style={styles.mark}>S</Text><Text style={styles.brandName}>S-Aloha</Text></View>
        <Text style={styles.kicker}>SERVICE DESK · ITIL 4</Text>
        <Text style={styles.title}>Le service, partout.</Text>
        <Text style={styles.subtitle}>Connectez-vous avec votre compte Active Directory.</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Identifiant</Text>
          <TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setUsername} placeholder="nom d’utilisateur" placeholderTextColor="#8794a7" style={styles.input} value={username} returnKeyType="next" />
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput onChangeText={setPassword} placeholder="Mot de passe" placeholderTextColor="#8794a7" secureTextEntry style={styles.input} value={password} onSubmitEditing={submit} returnKeyType="go" />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" disabled={busy || !username || !password} onPress={submit} style={({ pressed }) => [styles.button, (busy || !username || !password) && styles.disabled, pressed && styles.pressed]}>
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
          </Pressable>
        </View>
        <Text style={styles.footer}>Vos identifiants sont vérifiés par l’annuaire de votre organisation.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' }, page: { flex: 1, justifyContent: 'center', paddingHorizontal: 26, paddingVertical: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 52 }, mark: { overflow: 'hidden', borderRadius: 13, backgroundColor: '#125cdb', color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', textAlignVertical: 'center', width: 48, height: 48 },
  brandName: { color: '#13213a', fontSize: 23, fontWeight: '800' }, kicker: { color: '#125cdb', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 }, title: { color: '#13213a', fontSize: 34, fontWeight: '800', letterSpacing: -1 }, subtitle: { color: '#627087', fontSize: 16, lineHeight: 24, marginTop: 10, maxWidth: 330 },
  form: { marginTop: 34 }, label: { color: '#263650', fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 14 }, input: { backgroundColor: '#fff', borderColor: '#dce3ed', borderRadius: 12, borderWidth: 1, color: '#13213a', fontSize: 16, paddingHorizontal: 15, paddingVertical: 15 },
  button: { alignItems: 'center', backgroundColor: '#125cdb', borderRadius: 12, justifyContent: 'center', marginTop: 24, minHeight: 54 }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' }, disabled: { opacity: 0.5 }, pressed: { opacity: 0.8 }, error: { color: '#b42318', fontSize: 14, marginTop: 14 }, footer: { color: '#758198', fontSize: 13, lineHeight: 20, marginTop: 30 }
});
