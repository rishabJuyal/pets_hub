import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Badge } from './Badge';
import { AppText } from './AppText';
import { Appointment } from '../types';

interface AppointmentCardProps {
  appointment: Appointment;
  isAdminView?: boolean;
  isAdmin?: boolean;
  onClick?: () => void;
  onPress?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onReschedule?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

const DOG_AVATAR = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80';
const CAT_AVATAR = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80';

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  isAdminView = false,
  isAdmin,
  onClick,
  onPress,
  onApprove,
  onReject,
  onReschedule,
  onComplete,
  onCancel,
}) => {
  const isActualAdmin = isAdmin ?? isAdminView;
  const handlePress = onClick || onPress;

  const statusConfig: Record<string, { variant: any; label: string }> = {
    PENDING: { variant: 'pending', label: 'Pending' },
    CONFIRMED: { variant: 'confirmed', label: 'Confirmed' },
    COMPLETED: { variant: 'completed', label: 'Completed' },
    CANCELLED: { variant: 'cancelled', label: 'Cancelled' },
  };
  const status = statusConfig[appointment.status] || statusConfig.PENDING;
  const petAvatar = appointment.petSpecies?.toLowerCase() === 'cat' ? CAT_AVATAR : DOG_AVATAR;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      <View style={styles.topRow}>
        <Image source={{ uri: petAvatar }} style={styles.petAvatar} />

        <View style={styles.petInfoCol}>
          <View style={styles.nameAndBadgeRow}>
            <AppText variant="label" style={styles.petName}>
              {appointment.petName} ({appointment.petSpecies})
            </AppText>
            <Badge variant={status.variant} label={status.label} />
          </View>

          <AppText variant="caption" style={styles.serviceTitle} numberOfLines={1}>
            {appointment.serviceTitle}
          </AppText>
        </View>

        <TouchableOpacity style={styles.menuDotsBtn} onPress={handlePress}>
          <Ionicons name="ellipsis-horizontal" size={17} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {isActualAdmin && (
        <View style={styles.ownerRow}>
          <Ionicons name="person" size={12} color={Colors.textSecondary} />
          <AppText variant="caption" style={styles.ownerText}>
            Owner: {appointment.customerName}
          </AppText>
          <AppText variant="caption" style={styles.dotSeparator}>•</AppText>
          <AppText variant="caption" style={styles.ownerPhone}>
            {appointment.customerPhone}
          </AppText>
        </View>
      )}

      <View style={styles.dateTimePriceRow}>
        <View style={styles.dateTimeGroup}>
          <View style={styles.iconChip}>
            <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
            <AppText variant="caption" style={styles.dateTimeText}>
              {appointment.appointmentDate}
            </AppText>
          </View>

          <View style={[styles.iconChip, { marginLeft: 10 }]}>
            <Ionicons name="time-outline" size={12} color={Colors.primary} />
            <AppText variant="caption" style={styles.dateTimeText}>
              {appointment.appointmentTime}
            </AppText>
          </View>
        </View>

        <AppText variant="h3" style={styles.priceText}>
          ₹{Math.round(appointment.servicePrice)}
        </AppText>
      </View>

      {!!appointment.notes && (
        <AppText variant="caption" style={styles.notesText} numberOfLines={2}>
          Notes: {appointment.notes}
        </AppText>
      )}

      {!!appointment.adminNotes && (
        <AppText variant="caption" style={styles.adminNotesText} numberOfLines={1}>
          Clinic note: {appointment.adminNotes}
        </AppText>
      )}

      {isActualAdmin ? (
        <View style={styles.actionsRow}>
          {appointment.status === 'PENDING' && (
            <>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={onApprove}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                <AppText variant="button" style={styles.approveBtnText}>
                  Approve
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.declineBtn}
                onPress={onReject}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={14} color={Colors.primary} />
                <AppText variant="button" style={styles.declineBtnText}>
                  Decline
                </AppText>
              </TouchableOpacity>
            </>
          )}

          {appointment.status === 'CONFIRMED' && (
            <>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={onComplete}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />
                <AppText variant="button" style={styles.approveBtnText}>
                  Complete
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.declineBtn}
                onPress={onReschedule}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={13} color={Colors.primary} />
                <AppText variant="button" style={styles.declineBtnText}>
                  Reschedule
                </AppText>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        appointment.status === 'PENDING' && (
          <View style={styles.customerActionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={styles.cancelBtnText}>
                Cancel Request
              </AppText>
            </TouchableOpacity>
          </View>
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceMuted,
    marginRight: 10,
  },
  petInfoCol: {
    flex: 1,
  },
  nameAndBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  petName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  serviceTitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  menuDotsBtn: {
    padding: 4,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 6,
    gap: 4,
  },
  ownerText: {
    fontSize: 10.5,
    color: Colors.textSecondary,
  },
  dotSeparator: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  ownerPhone: {
    fontSize: 10.5,
    color: Colors.textSecondary,
  },
  dateTimePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  dateTimeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  notesText: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  adminNotesText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  approveBtn: {
    flex: 1,
    height: 35,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  declineBtn: {
    flex: 1,
    height: 35,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  declineBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  customerActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.danger,
  },
});
