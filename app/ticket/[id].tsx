import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  fetchTicketById,
  updateTicketStatusAndComment,
} from '../../src/services/salohaApi';
import { Ticket, TicketStatus } from '../../src/types/saloha';

const STATUSES: TicketStatus[] = ['Nouveau', 'En cours', 'En attente', 'Resolu', 'Clos'];

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [status, setStatus] = useState<TicketStatus>('En cours');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchTicketById(id).then((found) => {
      if (found) {
        setTicket(found);
        setStatus(found.status);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    if (!ticket) return;
    setSaving(true);
    try {
      const updated = await updateTicketStatusAndComment(ticket.id, status, comment);
      if (updated) {
        setTicket(updated);
        setComment('');
      }
      Alert.alert('Mis a jour', 'Le statut et le journal du ticket ont ete enregistres.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Echec mise a jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0f4c81" style={{ marginTop: 32 }} />;
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ticket introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.ref}>{ticket.reference} • {ticket.type.toUpperCase()}</Text>
      <Text style={styles.title}>{ticket.title}</Text>
      <Text style={styles.desc}>{ticket.description}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Priorite : {ticket.priority}</Text>
        {ticket.assignee ? <Text style={styles.infoText}>Affectation : {ticket.assignee}</Text> : null}
        {ticket.ciName ? <Text style={styles.infoText}>CI associe : {ticket.ciName}</Text> : null}
        {ticket.slaDeadline ? <Text style={styles.infoText}>SLA : {ticket.slaDeadline}</Text> : null}
      </View>

      <Text style={styles.label}>Statut ITIL</Text>
      <View style={styles.row}>
        {STATUSES.map((st) => (
          <Pressable
            key={st}
            onPress={() => setStatus(st)}
            style={[styles.chip, status === st && styles.chipActive]}
          >
            <Text style={[styles.chipText, status === st && styles.chipTextActive]}>{st}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Ajouter une note / action terrain</Text>
      <TextInput
        style={styles.input}
        placeholder="Diagnostic, commande lancee, escalade..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Pressable
        disabled={saving}
        onPress={handleSave}
        style={[styles.btn, saving && { opacity: 0.6 }]}
      >
        <Text style={styles.btnText}>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</Text>
      </Pressable>

      <Text style={styles.label}>Journal d activite</Text>
      {(ticket.comments ?? []).length === 0 ? (
        <Text style={styles.muted}>Aucune note enregistree pour le moment.</Text>
      ) : (
        (ticket.comments ?? []).map((c) => (
          <View key={c.id} style={styles.commentCard}>
            <Text style={styles.commentMeta}>{c.author} • {c.createdAt}</Text>
            <Text style={styles.commentBody}>{c.body}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { padding: 16, gap: 10 },
  ref: { fontWeight: '700', color: '#0f4c81', fontSize: 13 },
  title: { fontSize: 19, fontWeight: '700', color: '#0f172a' },
  desc: { fontSize: 14, color: '#334155' },
  infoBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  infoText: { fontSize: 13, color: '#1e293b' },
  label: { fontWeight: '700', color: '#0f172a', marginTop: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  chipActive: { backgroundColor: '#0f4c81', borderColor: '#0f4c81' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  chipTextActive: { color: '#ffffff' },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#0f172a',
  },
  btn: {
    backgroundColor: '#0f4c81',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  muted: { fontSize: 13, color: '#64748b' },
  commentCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  commentMeta: { fontSize: 12, fontWeight: '600', color: '#475569' },
  commentBody: { fontSize: 14, color: '#0f172a' },
});
