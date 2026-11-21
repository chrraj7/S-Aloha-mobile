import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchCmdbItems } from '../../src/services/salohaApi';
import { CmdbiItem } from '../../src/types/saloha';

export default function CmdbScreen() {
  const [items, setItems] = useState<CmdbiItem[]>([]);

  useEffect(() => {
    fetchCmdbItems().then(setItems);
  }, []);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
          <Text style={styles.sub}>
            {item.category} • {item.environment} • {item.ipOrHost}
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
    gap: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: '700', fontSize: 15, color: '#0f172a' },
  status: { fontWeight: '600', fontSize: 12, color: '#0f4c81' },
  sub: { fontSize: 13, color: '#475569' },
});
