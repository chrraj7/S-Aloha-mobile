import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { fetchTickets } from '../../src/services/salohaApi';
import { Ticket } from '../../src/types/saloha';

export default function TicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load(true);
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Link href="/ticket/new" asChild>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>+ Nouveau ticket</Text>
          </Pressable>
        </Link>
        <Link href="/settings" asChild>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Serveur / API</Text>
          </Pressable>
        </Link>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0f4c81" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
          }
          renderItem={({ item }) => (
            <Link href={`/ticket/${item.id}`} asChild>
              <Pressable style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.ref}>{item.reference}</Text>
                  <Text style={styles.badge}>{item.status}</Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>{item.priority}</Text>
                  {item.slaDeadline ? (
                    <Text style={styles.meta}>SLA: {item.slaDeadline}</Text>
                  ) : null}
                  <Text style={styles.meta}>{item.updatedAt}</Text>
                </View>
              </Pressable>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  topBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#0f4c81',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontWeight: '600' },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0f4c81',
    justifyContent: 'center',
  },
  secondaryBtnText: { color: '#0f4c81', fontWeight: '600' },
  errorBox: {
    margin: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  errorText: { color: '#991b1b', fontWeight: '500' },
  listContent: { padding: 12, gap: 10 },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ref: { fontWeight: '700', color: '#0f4c81', fontSize: 13 },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  desc: { fontSize: 14, color: '#475569' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  meta: { fontSize: 12, color: '#64748b' },
});
