import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, type Incident } from '../src/api';
import { BrandMark } from '../src/BrandMark';
import { colors, radius, typography } from '../src/theme';
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
      setIncidents(records.slice(0, 20)); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Chargement impossible.'); }
    finally { setLoading(false); }
  }, [router]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  useEffect(() => {
    if (error.includes('Session expirée') || error.includes('(401)')) void clearToken().then(() => router.replace('/login'));
  }, [error, router]);

  async function logout() {
    try { await api.logout(); } catch { /* Expired sessions can still be cleared locally. */ }
    await clearToken(); router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.identity}><BrandMark size={34} /><View><Text style={styles.eyebrow}>S-ALOHA · MOBILE</Text><Text style={styles.title}>Bonjour{displayName ? `, ${displayName}` : ''}</Text></View></View>
          <Pressable accessibilityRole="button" onPress={logout} style={styles.logout}><Text style={styles.logoutText}>Quitter</Text></Pressable>
        </View>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>VOTRE ACTION DU MOMENT</Text>
          <Text style={styles.heroTitle}>Gardez le service en mouvement.</Text>
          <Text style={styles.heroCopy}>Retrouvez vos incidents et les priorités de votre service.</Text>
          <View style={styles.heroRule} />
          <Text style={styles.heroFoot}>Service alohan’ny zavatra rehetra</Text>
        </View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Incidents récents</Text><Pressable accessibilityRole="button" onPress={() => void load()}><Text style={styles.refresh}>Actualiser</Text></Pressable></View>
        {loading ? <ActivityIndicator color={colors.accentBlue} style={styles.loader} /> : error ? <Text accessibilityRole="alert" style={styles.message}>{error}</Text> : incidents.length === 0 ? <Text style={styles.message}>Aucun incident à afficher.</Text> : incidents.map((incident) => (
          <View key={incident.id} style={styles.card}>
            <View style={styles.cardTop}><Text style={styles.reference}>{incident.reference || `#${incident.id}`}</Text><Text style={[styles.priority, incident.priority === 'P1' && styles.urgent, incident.priority === 'P2' && styles.warning]}>{incident.priority || '—'}</Text></View>
            <Text style={styles.cardTitle}>{incident.title || 'Incident sans titre'}</Text>
            <Text style={styles.cardMeta}>{incident.status || 'Statut inconnu'} · {incident.affectedService || 'Service non renseigné'}</Text>
          </View>
        ))}
        <Text style={styles.note}>Aperçu mobile en lecture seule · <Text style={styles.noteStrong}>Code source AGPLv3</Text></Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.app }, content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 }, identity: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  eyebrow: { color: colors.tertiary, fontFamily: typography.body, fontSize: 10, fontWeight: '600', letterSpacing: 1.1 }, title: { color: colors.text, fontFamily: typography.display, fontSize: 19, fontWeight: '500', marginTop: 4, maxWidth: 210 },
  logout: { borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 8 }, logoutText: { color: colors.secondary, fontFamily: typography.body, fontSize: 12, fontWeight: '600' },
  hero: { backgroundColor: colors.nav, borderColor: '#223658', borderRadius: radius.panel, borderWidth: 1, overflow: 'hidden', padding: 20 },
  heroLabel: { color: colors.accentTeal, fontFamily: typography.body, fontSize: 10, fontWeight: '700', letterSpacing: 1.3 }, heroTitle: { color: colors.text, fontFamily: typography.display, fontSize: 24, fontWeight: '500', lineHeight: 31, marginTop: 14 },
  heroCopy: { color: colors.secondary, fontFamily: typography.body, fontSize: 14, lineHeight: 21, marginTop: 8 }, heroRule: { backgroundColor: colors.accentBlue, height: 2, marginTop: 20, width: 44 }, heroFoot: { color: colors.tertiary, fontFamily: typography.body, fontSize: 11, fontStyle: 'italic', marginTop: 8 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, marginTop: 28 }, sectionTitle: { color: colors.text, fontFamily: typography.display, fontSize: 18, fontWeight: '500' }, refresh: { color: colors.accentBlue, fontFamily: typography.body, fontSize: 13, fontWeight: '600' }, loader: { marginTop: 26 },
  message: { color: colors.secondary, fontFamily: typography.body, fontSize: 14, lineHeight: 21, marginTop: 16 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: 1, marginTop: 10, padding: 15 }, cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  reference: { color: colors.secondary, fontFamily: typography.mono, fontSize: 12, fontWeight: '500' }, priority: { backgroundColor: colors.accentBlueSoft, borderColor: '#274b77', borderRadius: radius.badge, borderWidth: 1, color: colors.accentBlue, fontFamily: typography.body, fontSize: 11, fontWeight: '700', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3 },
  urgent: { backgroundColor: colors.accentRedSoft, borderColor: '#71302f', color: colors.accentRed }, warning: { backgroundColor: colors.accentAmberSoft, borderColor: '#65411b', color: colors.accentAmber },
  cardTitle: { color: colors.text, fontFamily: typography.body, fontSize: 15, fontWeight: '600', marginTop: 10 }, cardMeta: { color: colors.tertiary, fontFamily: typography.body, fontSize: 12, marginTop: 7 },
  note: { color: colors.tertiary, fontFamily: typography.body, fontSize: 11, lineHeight: 17, marginTop: 22 }, noteStrong: { color: colors.accentTeal },
});
