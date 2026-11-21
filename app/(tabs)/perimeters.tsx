import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  fetchNotifications,
  fetchPerimeters,
  getServerConfig,
  markNotificationRead,
  saveServerConfig,
} from '../../src/services/salohaApi';
import { NotificationItem, PerimeterItem } from '../../src/types/saloha';

export default function PerimetersAndAlertsScreen() {
  const [perimeters, setPerimeters] = useState<PerimeterItem[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    Promise.all([fetchPerimeters(), fetchNotifications(), getServerConfig()]).then(
      ([perims, notifs, cfg]) => {
        setPerimeters(perims);
        setNotifications(notifs);
        setActiveId(cfg.activePerimeterId ?? perims[0]?.id);
      }
    );
  }, []);

  const handleSelectPerimeter = async (id: string) => {
    setActiveId(id);
    const cfg = await getServerConfig();
    await saveServerConfig({ ...cfg, activePerimeterId: id });
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Perimetres en service</Text>
      {perimeters.map((p) => {
        const selected = p.id === activeId;
        return (
          <Pressable
            key={p.id}
            onPress={() => handleSelectPerimeter(p.id)}
            style={[styles.card, selected && styles.cardSelected]}
          >
            <View style={styles.row}>
              <Text style={styles.code}>{p.code}</Text>
              <Text style={styles.status}>{selected ? 'Actif' : p.criticality}</Text>
            </View>
            <Text style={styles.title}>{p.name}</Text>
            <Text style={styles.meta}>
              Etat : {p.inService ? 'En service' : 'Hors service'}
            </Text>
          </Pressable>
        );
      })}

      <Text style={styles.sectionTitle}>Notifications & alertes</Text>
      {notifications.map((n) => (
        <Pressable
          key={n.id}
          onPress={() => handleMarkRead(n.id)}
          style={[styles.card, !n.read && styles.unreadCard]}
        >
          <View style={styles.row}>
            <Text style={styles.title}>{n.title}</Text>
            <Text style={styles.meta}>{n.createdAt}</Text>
          </View>
          <Text style={styles.desc}>{n.message}</Text>
          <Text style={styles.meta}>{n.read ? 'Lu' : 'Non lu (toucher pour marquer lu)'}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { padding: 12, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 4 },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 5,
  },
  cardSelected: { borderColor: '#0f4c81', borderWidth: 2 },
  unreadCard: { backgroundColor: '#f0f9ff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontWeight: '700', color: '#0f4c81', fontSize: 13 },
  status: { fontWeight: '700', color: '#0369a1', fontSize: 12 },
  title: { fontWeight: '700', color: '#0f172a', fontSize: 14, flex: 1, marginRight: 8 },
  desc: { fontSize: 13, color: '#334155' },
  meta: { fontSize: 12, color: '#64748b' },
});
