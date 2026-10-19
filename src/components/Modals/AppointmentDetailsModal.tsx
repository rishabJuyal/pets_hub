import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Appointment } from '../../types';

interface AppointmentDetailsModalProps {
  visible: boolean;
  appointment: Appointment | null;
  isAdmin?: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
  onReschedule?: () => void;
  onComplete?: () => void;
  onCancel?: (reason: string) => void;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  visible,
  appointment,
  isAdmin = false,
  onClose,
  onApprove,
  onReject,
  onReschedule,
  onComplete,
  onCancel,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelInput, setShowCancelInput] = useState(false);

  if (!appointment) return null;

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={styles.overlay}>
        {/* Backdrop that blocks touch/scroll passthrough to the background screen */}
        <View style={styles.backdrop} onTouchStart={() => {}} onTouchEnd={() => {}} />
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <View style={styles.iconCircle}>
                <Ionicons name="document-text" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.title}>Appointment Details</Text>
                <Text style={styles.subtitle}>ID: {appointment.id}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Status Strip */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Booking Status:</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusValue}>{appointment.status}</Text>
              </View>
            </View>

            {/* Pet & Owner Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Pet & Parent Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Pet:</Text>
                <Text style={styles.infoVal}>{appointment.petName} ({appointment.petSpecies})</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Owner:</Text>
                <Text style={styles.infoVal}>{appointment.customerName}</Text>
              </View>
              {appointment.customerPhone ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoKey}>Contact Phone:</Text>
                  <Text style={styles.infoVal}>{appointment.customerPhone}</Text>
                </View>
              ) : null}
            </View>

            {/* Service & Time Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Service & Slot</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Service:</Text>
                <Text style={styles.infoVal}>{appointment.serviceTitle}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Consultation Fee:</Text>
                <Text style={[styles.infoVal, { color: Colors.primary, fontWeight: '800' }]}>
                  ₹{appointment.servicePrice}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Scheduled Date:</Text>
                <Text style={styles.infoVal}>{appointment.appointmentDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Scheduled Time:</Text>
                <Text style={styles.infoVal}>{appointment.appointmentTime}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoKey}>Clinic Venue:</Text>
                <Text style={styles.infoVal}>Silver Jubilee Road, Near Rani Palace, Sikar</Text>
              </View>
            </View>

            {/* Notes Section */}
            {appointment.notes ? (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Symptoms / Care Notes</Text>
                <Text style={styles.notesText}>{appointment.notes}</Text>
              </View>
            ) : null}

            {/* Doctor Notes Section */}
            {appointment.adminNotes ? (
              <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: Colors.rubyAccent }]}>Doctor / Clinic Notes</Text>
                <Text style={styles.doctorNotesText}>{appointment.adminNotes}</Text>
              </View>
            ) : null}

            {/* Inline Reject Input */}
            {showRejectInput && (
              <View style={styles.inputBox}>
                <Text style={styles.inputBoxLabel}>Decline Reason:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Doctor unavailable, emergency slot required..."
                  value={rejectReason}
                  onChangeText={setRejectReason}
                />
                <TouchableOpacity
                  style={styles.confirmDeclineBtn}
                  onPress={() => {
                    onReject?.(rejectReason || 'Declined due to clinic capacity.');
                    setShowRejectInput(false);
                    onClose();
                  }}
                >
                  <Text style={styles.confirmDeclineText}>Confirm Decline</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Inline Customer Cancel Input */}
            {showCancelInput && (
              <View style={styles.inputBox}>
                <Text style={styles.inputBoxLabel}>Reason for Cancellation:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Plans changed, feeling better..."
                  value={cancelReason}
                  onChangeText={setCancelReason}
                />
                <TouchableOpacity
                  style={styles.confirmDeclineBtn}
                  onPress={() => {
                    onCancel?.(cancelReason || 'Cancelled by customer');
                    setShowCancelInput(false);
                    onClose();
                  }}
                >
                  <Text style={styles.confirmDeclineText}>Confirm Cancellation</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            {isAdmin ? (
              <View style={styles.btnRow}>
                {appointment.status === 'PENDING' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => {
                        onApprove?.();
                        onClose();
                      }}
                    >
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => setShowRejectInput(!showRejectInput)}
                    >
                      <Text style={styles.rejectBtnText}>Decline</Text>
                    </TouchableOpacity>
                  </>
                )}
                {appointment.status === 'CONFIRMED' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.completeBtn]}
                      onPress={() => {
                        onComplete?.();
                        onClose();
                      }}
                    >
                      <Text style={styles.completeBtnText}>Mark Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rescheduleBtn]}
                      onPress={() => {
                        onClose();
                        onReschedule?.();
                      }}
                    >
                      <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : (
              appointment.status === 'PENDING' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={() => setShowCancelInput(!showCancelInput)}
                >
                  <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusPill: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  section: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  infoKey: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    maxWidth: '65%',
    textAlign: 'right',
  },
  notesText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  doctorNotesText: {
    fontSize: 13,
    color: Colors.rubyAccent,
    fontWeight: '600',
    lineHeight: 18,
  },
  inputBox: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: Colors.rubyContainer,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  inputBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.rubyAccent,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 8,
  },
  confirmDeclineBtn: {
    backgroundColor: Colors.rubyAccent,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmDeclineText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: Colors.primary,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  rejectBtn: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  rejectBtnText: {
    color: Colors.rubyAccent,
    fontWeight: '700',
    fontSize: 13,
  },
  completeBtn: {
    backgroundColor: '#16A34A',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  rescheduleBtn: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rescheduleBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  cancelBtn: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  cancelBtnText: {
    color: Colors.rubyAccent,
    fontWeight: '700',
    fontSize: 13,
  },
});
