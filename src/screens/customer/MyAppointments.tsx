import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { usePetsHub } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { AppText } from '../../components/AppText';
import { AppointmentCard } from '../../components/AppointmentCard';
import { AppointmentDetailsModal } from '../../components/Modals/AppointmentDetailsModal';
import { Appointment } from '../../types';

interface MyAppointmentsProps {
  onNavigateToBook: () => void;
}

type TabType = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

const TABS: { label: string; value: TabType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const MyAppointments: React.FC<MyAppointmentsProps> = ({ onNavigateToBook }) => {
  const { customerAppointments, cancelCustomerAppointment } = usePetsHub();

  const [selectedTab, setSelectedTab] = useState<TabType>('ALL');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  const filteredAppointments = customerAppointments.filter((apt) => {
    switch (selectedTab) {
      case 'ALL':
        return true;
      case 'UPCOMING':
        return apt.status === 'PENDING' || apt.status === 'CONFIRMED';
      case 'COMPLETED':
        return apt.status === 'COMPLETED';
      case 'CANCELLED':
        return apt.status === 'CANCELLED';
    }
  });

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <AppText variant="h2" style={[styles.screenTitle, { color: Colors.textPrimary }]}>
            My Appointments
          </AppText>
          <AppText variant="bodySmall" style={[styles.screenSubtitle, { color: Colors.textSecondary }]}>
            Track visits, reschedule or cancel bookings
          </AppText>
        </View>

        <Button
          title="+ Book"
          variant="outline"
          onPress={onNavigateToBook}
          style={styles.bookBtn}
        />
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isSelected = selectedTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.tabBox, isSelected && styles.tabBoxSelected]}
              onPress={() => setSelectedTab(tab.value)}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title={`No ${selectedTab.toLowerCase()} appointments found.`}
          buttonTitle="Book Care Now"
          onPress={onNavigateToBook}
        />
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              isAdminView={false}
              onClick={() => setSelectedApt(item)}
              onCancel={() => cancelCustomerAppointment(item.id, 'Cancelled by owner')}
            />
          )}
        />
      )}

      <AppointmentDetailsModal
        visible={!!selectedApt}
        appointment={selectedApt}
        onClose={() => setSelectedApt(null)}
        onCancel={(reason) =>
          selectedApt && cancelCustomerAppointment(selectedApt.id, reason)
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleCol: {
    flex: 1,
    marginRight: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  bookBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 38,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  tabBox: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBoxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabTextSelected: {
    fontWeight: '700',
    color: Colors.textWhite,
  },
  listContent: {
    paddingBottom: 30,
    gap: 10,
  },
});
