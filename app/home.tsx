import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, type Incident } from '../src/api';
import { clearToken, getToken } from '../src/session';

export default function HomeScreen() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');

  const load = useCallback(async () => {
    const token = await getToken();
    if (!token) { router.replace('/login'); return; }
    try {
      const [me, records] = await Promise.all([api.me(), api.incidents()]);
      setDisplayName(me.displayName || me.username);
      setIncidents(records.slice(0, 20));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Chargement impossible.');
    } finally { setLoading(false); }
  }, [router]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  useEffect(() => {
    if (error.includes('Session expirée') || error.includes('(401)')) {
      void clearToken().then(() => router.replace('/login'));
    }
  }, [error, router]);

  async function logout() {
    try { await api.logout(); } catch { /* Expired sessions can still be cleared locally. */ }
    await clearToken();
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>S-ALOHA · MOBILE</Text><Text style={styles.title}>Bonjour{displayName ? `, ${displayName}` : ''}</Text></View>
          <Pressable accessibilityRole="button" onPress={logout} style={styles.logout}><Text style={styles.logoutText}>Quitter</Text></Pressable>
        </View>
        <View style={styles.hero}><Text style={styles.heroLabel}>VOTRE ACTION DU MOMENT</Text><Text style={styles.heroTitle}>Gardez le service en mouvement.</Text><Text style={styles.heroCopy}>Retrouvez vos incidents depuis votre téléphone.</Text></View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Incidents récents</Text><Pressable onPress={() => void load()}><Text style={styles.refresh}>Actualiser</Text></Pressable></View>
        {loading ? <ActivityIndicator color="#125cdb" style={styles.loader} /> : error ? <Text accessibilityRole="alert" style={styles.message}>{error}</Text> : incidents.length === 0 ? <Text style={styles.message}>Aucun incident à afficher.</Text> : incidents.map((incident) => (
          <View key={incident.id} style={styles.card}>
            <View style={styles.cardTop}><Text style={styles.reference}>{incident.reference || `#${incident.id}`}</Text><Text style={[styles.priority, incident.priority === 'P1' && styles.urgent]}>{incident.priority || '—'}</Text></View>
            <Text style={styles.cardTitle}>{incident.title || 'Incident sans titre'}</Text>
            <Text style={styles.cardMeta}>{incident.status || 'Statut inconnu'} · {incident.affectedService || 'Service non renseigné'}</Text>
          </View>
        ))}
        <Text style={styles.note}>Affichage en lecture seule pour ce premier aperçu mobile.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' }, content: { padding: 22, paddingBottom: 40 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }, eyebrow: { color: '#125cdb', fontSize: 11, fontWeight: '800', letterSpacing: 1.3 }, title: { color: '#13213a', fontSize: 25, fontWeight: '800', marginTop: 7 }, logout: { padding: 10 }, logoutText: { color: '#53627a', fontSize: 14, fontWeight: '700' },
  hero: { backgroundColor: '#123d86', borderRadius: 20, padding: 22 }, heroLabel: { color: '#b9d1ff', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 31, marginTop: 14 }, heroCopy: { color: '#d6e4ff', fontSize: 14, lineHeight: 21, marginTop: 8 }, sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 30 }, sectionTitle: { color: '#13213a', fontSize: 19, fontWeight: '800' }, refresh: { color: '#125cdb', fontSize: 14, fontWeight: '700' }, loader: { marginTop: 28 }, message: { color: '#627087', fontSize: 15, lineHeight: 22, marginTop: 16 },
  card: { backgroundColor: '#fff', borderColor: '#e5eaf1', borderRadius: 15, borderWidth: 1, marginTop: 10, padding: 16 }, cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, reference: { color: '#125cdb', fontSize: 12, fontWeight: '800' }, priority: { backgroundColor: '#eef2f8', borderRadius: 6, color: '#53627a', fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4 }, urgent: { backgroundColor: '#fee4e2', color: '#b42318' }, cardTitle: { color: '#192a45', fontSize: 16, fontWeight: '700', marginTop: 10 }, cardMeta: { color: '#758198', fontSize: 13, marginTop: 7 }, note: { color: '#8994a6', fontSize: 12, lineHeight: 18, marginTop: 24 }
});
