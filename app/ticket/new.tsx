import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { createTicket } from '../../src/services/salohaApi';
import { TicketPriority, TicketType } from '../../src/types/saloha';

export default function NewTicketScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TicketType>('incident');
  const [priority, setPriority] = useState<TicketPriority>('P2 - Eleve');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir un titre pour le ticket.');
      return;
    }
    setSubmitting(true);
    try {
      await createTicket({
        title: title.trim(),
        description: description.trim() || 'Ouvert depuis S-Aloha Mobile',
        type,
        priority,
        status: 'Nouveau',
      });
      Alert.alert('Ticket cree', 'Le ticket a bien ete enregistre.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Echec de creation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        {(['incident', 'demande', 'changement'] as TicketType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setType(t)}
            style={[styles.chip, type === t && styles.chipActive]}
          >
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Panne imprimante reseau batiment B"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Contexte, impact utilisateurs, CI concernes..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Priorite</Text>
      <View style={styles.row}>
        {(['P1 - Critique', 'P2 - Eleve', 'P3 - Moyen'] as TicketPriority[]).map((p) => (
          <Pressable
            key={p}
            onPress={() => setPriority(p)}
            style={[styles.chip, priority === p && styles.chipActive]}
          >
            <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        disabled={submitting}
        onPress={handleSubmit}
        style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
      >
        <Text style={styles.submitText}>
          {submitting ? 'Envoi...' : 'Enregistrer le ticket'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff', gap: 10 },
  label: { fontWeight: '700', color: '#0f172a', marginTop: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  chipActive: { backgroundColor: '#0f4c81', borderColor: '#0f4c81' },
  chipText: { color: '#334155', fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#ffffff' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#0f172a',
  },
  multiline: { height: 96, textAlignVertical: 'top' },
  submitBtn: {
    marginTop: 12,
    backgroundColor: '#0f4c81',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
