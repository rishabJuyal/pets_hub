import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Appointment } from '../../types';

interface RescheduleModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (newDate: string, newTime: string, notes: string) => void;
}

const DATE_PRESETS = ['Today', 'Tomorrow', 'In 2 Days', 'Saturday', 'Sunday'];
const TIME_PRESETS = ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  visible,
  appointment,
  onClose,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [adminNotes, setAdminNotes] = useState('');

  if (!appointment) return null;

  const handleConfirm = () => {
    onConfirm(selectedDate, selectedTime, adminNotes.trim());
    onClose();
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
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Reschedule Slot</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Appointment summary pill */}
            <View style={styles.summaryPill}>
              <Ionicons name="paw" size={14} color={Colors.primary} />
              <Text style={styles.summaryText}>
                {appointment.petName} ({appointment.serviceTitle}) • Current: {appointment.appointmentDate} at {appointment.appointmentTime}
              </Text>
            </View>

            {/* Select Date */}
            <Text style={styles.label}>Select New Date</Text>
            <View style={styles.presetsRow}>
              {DATE_PRESETS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.presetPill, selectedDate === d && styles.presetPillActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[styles.presetText, selectedDate === d && styles.presetTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select Time */}
            <Text style={styles.label}>Select New Time Slot</Text>
            <View style={styles.presetsRow}>
              {TIME_PRESETS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.presetPill, selectedTime === t && styles.presetPillActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.presetText, selectedTime === t && styles.presetTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Admin Reason / Notes to Owner */}
            <Text style={styles.label}>Reason / Doctor Note to Owner</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="e.g. Doctor Dr. Raj Sharma is attending surgery at 11 AM, shifted to 04:30 PM..."
              value={adminNotes}
              onChangeText={setAdminNotes}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Confirm Reschedule</Text>
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
  headerRow: {
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
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceSubtle,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    height: 70,
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
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
