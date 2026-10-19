import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { usePetsHub } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { StatCard } from '../../components/StatCard';
import { AppointmentCard } from '../../components/AppointmentCard';
import { Appointment } from '../../types';
import { AppointmentDetailsModal } from '../../components/Modals/AppointmentDetailsModal';
import { RescheduleModal } from '../../components/Modals/RescheduleModal';
import { AddEditProductModal } from '../../components/Modals/AddEditProductModal';
import { BroadcastModal } from '../../components/Modals/BroadcastModal';
import { SupabaseConfigModal } from '../../components/Modals/SupabaseConfigModal';

interface AdminDashboardProps {
  onNavigateToAppointments: () => void;
  onNavigateToProducts: () => void;
  onNavigateToBroadcasts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToAppointments,
  onNavigateToProducts,
  onNavigateToBroadcasts,
}) => {
  const {
    adminPendingCount,
    adminTodayCount,
    adminConfirmedCount,
    adminTotalCustomers,
    appointments,
    adminApproveAppointment,
    adminRejectAppointment,
    adminRescheduleAppointment,
    adminCompleteAppointment,
    addProduct,
    sendBroadcastNotification,
    supabaseConfig,
    updateSupabaseConfig,
  } = usePetsHub();

  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  const todayAppointments = appointments.filter(
    (a) => a.appointmentDate.toLowerCase() === 'today'
  );

  // Formatted date matching reference: "Oct 19, 2026"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Screen>
      {/* Clinic Overview Header with Date Chip */}
      <View style={styles.topHeaderSection}>
        <View style={styles.headerTitleGroup}>
          <View style={styles.titleWithAccent}>
            <View style={styles.titleRow}>
              <AppText variant="h2" style={styles.titleBold}>Clinic</AppText>
              <AppText variant="h2" style={[styles.titleBold, styles.titleNormal]}>Overview</AppText>
            </View>
            <View style={styles.titleUnderline} />
          </View>
          <AppText variant="caption" style={styles.subtitleText}>
            Here's what's happening today
          </AppText>
        </View>

        <View style={styles.dateChip}>
          <Ionicons name="calendar-outline" size={13} color={Colors.primary} />
          <AppText variant="caption" style={styles.dateChipText}>
            {formattedDate}
          </AppText>
        </View>
      </View>

      {/* 4 Stat Cards in 2x2 Grid */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiRow}>
          <StatCard
            title="Today's Schedule"
            value={adminTodayCount.toString()}
            icon="calendar"
            iconColor={Colors.primary}
            iconBgColor={Colors.primaryContainer}
            subtext="Active today →"
            onPress={onNavigateToAppointments}
          />
          <StatCard
            title="Pending Requests"
            value={adminPendingCount.toString()}
            icon="hourglass-outline"
            iconColor={Colors.warning}
            iconBgColor={Colors.warningBg}
            subtext="Needs action →"
            onPress={onNavigateToAppointments}
          />
        </View>
        <View style={styles.kpiRow}>
          <StatCard
            title="Confirmed Bookings"
            value={adminConfirmedCount.toString()}
            icon="checkmark"
            iconColor={Colors.success}
            iconBgColor={Colors.successBg}
            subtext="Scheduled →"
            onPress={onNavigateToAppointments}
          />
          <StatCard
            title="Registered Owners"
            value={adminTotalCustomers.toString()}
            icon="people"
            iconColor={Colors.primary}
            iconBgColor="#FCE7F3"
            subtext="Sikar Region →"
          />
        </View>
      </View>

      {/* Today's Appointments Section */}
      <View style={styles.sectionHeaderRow}>
        <AppText variant="h3" style={styles.sectionTitle}>
          Today's Appointments ({todayAppointments.length})
        </AppText>
        <TouchableOpacity onPress={onNavigateToAppointments} activeOpacity={0.7}>
          <AppText variant="caption" style={styles.sectionActionText}>
            View All ({appointments.length}) →
          </AppText>
        </TouchableOpacity>
      </View>

      {todayAppointments.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={32} color={Colors.textMuted} />
          <AppText variant="caption" style={styles.emptyText}>
            No appointments scheduled for today.
          </AppText>
        </View>
      ) : (
        todayAppointments.map((apt) => (
          <AppointmentCard
            key={apt.id}
            appointment={apt}
            isAdminView={true}
            onClick={() => setSelectedApt(apt)}
            onApprove={() => adminApproveAppointment(apt.id)}
            onReject={() => adminRejectAppointment(apt.id, 'Staff declined due to capacity.')}
            onReschedule={() => setReschedulingApt(apt)}
            onComplete={() => adminCompleteAppointment(apt.id)}
          />
        ))
      )}

      {/* Modals */}
      <AppointmentDetailsModal
        visible={!!selectedApt}
        appointment={selectedApt}
        isAdmin={true}
        onClose={() => setSelectedApt(null)}
        onApprove={() => selectedApt && adminApproveAppointment(selectedApt.id)}
        onReject={(reason) => selectedApt && adminRejectAppointment(selectedApt.id, reason)}
        onReschedule={() => {
          const apt = selectedApt;
          setSelectedApt(null);
          setReschedulingApt(apt);
        }}
        onComplete={() => selectedApt && adminCompleteAppointment(selectedApt.id)}
      />

      <RescheduleModal
        visible={!!reschedulingApt}
        appointment={reschedulingApt}
        onClose={() => setReschedulingApt(null)}
        onConfirm={(d, t, n) =>
          reschedulingApt && adminRescheduleAppointment(reschedulingApt.id, d, t, n)
        }
      />

      <AddEditProductModal
        visible={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSave={addProduct}
      />

      <BroadcastModal
        visible={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onSend={sendBroadcastNotification}
      />

      <SupabaseConfigModal
        visible={showSupabaseModal}
        config={supabaseConfig}
        onClose={() => setShowSupabaseModal(false)}
        onSave={updateSupabaseConfig}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  topHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    marginTop: 2,
  },
  headerTitleGroup: {
    flex: 1,
    paddingRight: 8,
  },
  titleWithAccent: {
    alignSelf: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBold: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  titleNormal: {
    marginLeft: 5,
    fontWeight: '700',
  },
  titleUnderline: {
    width: 42,
    height: 2.5,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 1,
  },
  subtitleText: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  kpiContainer: {
    gap: 9,
    marginBottom: 18,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 9,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
