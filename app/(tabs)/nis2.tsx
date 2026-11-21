import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchNis2Controls } from '../../src/services/salohaApi';
import { Nis2Control } from '../../src/types/saloha';

export default function Nis2Screen() {
  const [controls, setControls] = useState<Nis2Control[]>([]);

  useEffect(() => {
    fetchNis2Controls().then(setControls);
  }, []);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={controls}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.score}>{item.complianceScore}%</Text>
          </View>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.meta}>
            {item.domain} • Dernier audit : {item.lastAudit}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { padding: 12, gap: 10 },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontWeight: '700', color: '#0f4c81', fontSize: 13 },
  score: { fontWeight: '700', color: '#047857', fontSize: 15 },
  label: { fontWeight: '600', color: '#0f172a', fontSize: 14 },
  meta: { fontSize: 12, color: '#64748b' },
});
