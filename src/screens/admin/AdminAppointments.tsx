import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { usePetsHub } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { AppText } from '../../components/AppText';
import { AppointmentCard } from '../../components/AppointmentCard';
import { AppointmentDetailsModal } from '../../components/Modals/AppointmentDetailsModal';
import { RescheduleModal } from '../../components/Modals/RescheduleModal';
import { Appointment } from '../../types';

type TabType = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export const AdminAppointments: React.FC = () => {
  const {
    appointments,
    adminApproveAppointment,
    adminRejectAppointment,
    adminRescheduleAppointment,
    adminCompleteAppointment,
  } = usePetsHub();

  const [selectedTab, setSelectedTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);

  const tabs: { label: string; value: TabType; count: number }[] = [
    { label: 'All', value: 'ALL', count: appointments.length },
    {
      label: 'Pending',
      value: 'PENDING',
      count: appointments.filter((a) => a.status === 'PENDING').length,
    },
    {
      label: 'Confirmed',
      value: 'CONFIRMED',
      count: appointments.filter((a) => a.status === 'CONFIRMED').length,
    },
    {
      label: 'Completed',
      value: 'COMPLETED',
      count: appointments.filter((a) => a.status === 'COMPLETED').length,
    },
    {
      label: 'Cancelled',
      value: 'CANCELLED',
      count: appointments.filter((a) => a.status === 'CANCELLED').length,
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesTab =
      selectedTab === 'ALL' || apt.status === selectedTab;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      apt.petName.toLowerCase().includes(query) ||
      apt.customerName.toLowerCase().includes(query) ||
      apt.serviceTitle.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  return (
    <Screen scrollable={false}>
      <View style={styles.titleSection}>
        <AppText variant="h2" style={styles.screenTitle}>
          Clinic Bookings
        </AppText>
        <AppText variant="caption" style={styles.screenSubtitle}>
          Review consultation requests, confirm slots, reschedule or mark complete
        </AppText>
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={Colors.primary} />
        <TextInput
          placeholder="Search pet name, owner, service..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRowContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                style={[styles.tabBox, isSelected && styles.tabBoxSelected]}
                onPress={() => setSelectedTab(tab.value)}
                activeOpacity={0.8}
              >
                <AppText variant="caption" style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                  {tab.label} ({tab.count})
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
          <AppText variant="caption" style={styles.emptyText}>
            No appointments matching filters.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              isAdminView={true}
              onClick={() => setSelectedApt(item)}
              onApprove={() => adminApproveAppointment(item.id)}
              onReject={() =>
                adminRejectAppointment(item.id, 'Doctor declined due to clinic emergency.')
              }
              onReschedule={() => setReschedulingApt(item)}
              onComplete={() => adminCompleteAppointment(item.id)}
            />
          )}
        />
      )}

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
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchRow: {
    height: 38,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 11.5,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  tabsRowContainer: {
    marginBottom: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  tabBox: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBoxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#374151',
  },
  tabTextSelected: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 6,
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
