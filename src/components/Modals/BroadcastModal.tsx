import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface BroadcastModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: (title: string, message: string) => void;
}

const TEMPLATES = [
  {
    title: 'Anti-Rabies Vaccination Camp',
    message: 'Free rabies vaccination & health checkup camp this Sunday at Pet\'s Hub Sikar (Near Rani Palace). Bring your pets!',
  },
  {
    title: 'Seasonal Tick & Flea Warning',
    message: 'High tick infestation risk reported in Sikar region. Get herbal medicated anti-tick bath and spot-on drops at our clinic.',
  },
  {
    title: 'Clinic Holiday Notice',
    message: 'Pet\'s Hub emergency outpatient wing is open 24/7. Routine consultations will resume tomorrow morning at 9:00 AM.',
  },
];

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  visible,
  onClose,
  onSend,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    onSend(title.trim(), message.trim());
    setTitle('');
    setMessage('');
    onClose();
  };

  const applyTemplate = (t: { title: string; message: string }) => {
    setTitle(t.title);
    setMessage(t.message);
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        {/* Backdrop that blocks touch/scroll passthrough to the background screen */}
        <View style={styles.backdrop} onTouchStart={() => {}} onTouchEnd={() => {}} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="megaphone" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Broadcast Announcement</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Quick Templates */}
            <Text style={styles.label}>Quick Clinic Presets</Text>
            <View style={styles.templateList}>
              {TEMPLATES.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.templatePill}
                  onPress={() => applyTemplate(t)}
                >
                  <Text style={styles.templateText} numberOfLines={1}>
                    📢 {t.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title */}
            <Text style={styles.label}>Notice Headline *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Free Deworming Camp This Weekend"
              value={title}
              onChangeText={setTitle}
            />

            {/* Message */}
            <Text style={styles.label}>Notice Message *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Write the notification details dispatched to all registered pet owners in Sikar..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendBtn, (!title.trim() || !message.trim()) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!title.trim() || !message.trim()}
            >
              <Ionicons name="paper-plane" size={14} color="#FFFFFF" />
              <Text style={styles.sendBtnText}>Dispatch to All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  templateList: {
    gap: 6,
    marginBottom: 6,
  },
  templatePill: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  templateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  multilineInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  sendBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
