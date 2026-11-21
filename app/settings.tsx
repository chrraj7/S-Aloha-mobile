import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { getServerConfig, saveServerConfig } from '../src/services/salohaApi';

export default function SettingsScreen() {
  const [baseUrl, setBaseUrl] = useState('https://saloha.local/api');
  const [token, setToken] = useState('');
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    getServerConfig().then((cfg) => {
      setBaseUrl(cfg.baseUrl);
      setToken(cfg.token ?? '');
      setDemoMode(cfg.demoMode);
    });
  }, []);

  const handleSave = async () => {
    await saveServerConfig({
      baseUrl: baseUrl.trim(),
      token: token.trim() || undefined,
      demoMode,
    });
    Alert.alert('Configuration sauvegardee', 'Les parametres de connexion ont ete mis a jour.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Mode demonstration (donnees locales)</Text>
        <Switch value={demoMode} onValueChange={setDemoMode} />
      </View>

      <Text style={styles.label}>URL de l API S-Aloha (On-Prem)</Text>
      <TextInput
        style={styles.input}
        value={baseUrl}
        onChangeText={setBaseUrl}
        autoCapitalize="none"
        keyboardType="url"
      />

      <Text style={styles.label}>Jeton d acces / Session API (optionnel)</Text>
      <TextInput
        style={styles.input}
        value={token}
        onChangeText={setToken}
        placeholder="Bearer token ou session API"
        autoCapitalize="none"
        secureTextEntry
      />

      <Pressable style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Enregistrer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff', gap: 12 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: { fontWeight: '700', color: '#0f172a' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#0f172a',
  },
  btn: {
    marginTop: 8,
    backgroundColor: '#0f4c81',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
