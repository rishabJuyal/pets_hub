import React from 'react';
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
import { EmptyState } from '../../components/EmptyState';
import { AppText } from '../../components/AppText';
import { AppNotification } from '../../types';

interface CustomerNotificationsProps {
  onNavigateToAppointment?: (aptId: string) => void;
}

export const CustomerNotifications: React.FC<CustomerNotificationsProps> = ({
  onNavigateToAppointment,
}) => {
  const {
    customerNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = usePetsHub();

  const hasUnread = customerNotifications.some((n) => !n.isRead);

  const getIconName = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return 'megaphone';
      case 'APPOINTMENT_UPDATE':
        return 'paw';
      default:
        return 'notifications';
    }
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <AppText variant="h2" style={[styles.screenTitle, { color: Colors.textPrimary }]}>
            Notifications
          </AppText>
          <AppText variant="bodySmall" style={[styles.screenSubtitle, { color: Colors.textSecondary }]}>
            Doctor alerts, appointment confirmations & camps in Sikar
          </AppText>
        </View>

        {hasUnread && (
          <TouchableOpacity
            style={styles.readAllBtn}
            onPress={markAllNotificationsAsRead}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-done" size={16} color={Colors.primary} />
            <AppText variant="caption" style={[styles.readAllText, { color: Colors.primary }]}>
              Read All
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {customerNotifications.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="No notifications yet."
          subtitle="You will receive appointment updates and alerts here."
        />
      ) : (
        <FlatList
          data={customerNotifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isUnread = !item.isRead;
            return (
              <TouchableOpacity
                style={[
                  styles.notifCard,
                  isUnread ? styles.notifCardUnread : styles.notifCardRead,
                ]}
                onPress={() => {
                  markNotificationAsRead(item.id);
                  if (item.appointmentId && onNavigateToAppointment) {
                    onNavigateToAppointment(item.appointmentId);
                  }
                }}
                activeOpacity={0.85}
              >
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={getIconName(item.type)}
                    size={20}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.cardBodyCol}>
                  <View style={styles.cardHeaderRow}>
                    <AppText
                      variant="label"
                      style={[
                        styles.notifTitle,
                        { fontWeight: isUnread ? '700' : '600', color: Colors.textPrimary },
                      ]}
                    >
                      {item.title}
                    </AppText>
                    {isUnread && <View style={styles.unreadDot} />}
                  </View>

                  <AppText variant="caption" style={[styles.notifMessage, { color: Colors.textSecondary }]}>
                    {item.message}
                  </AppText>

                  <View style={styles.footerRow}>
                    <AppText variant="caption" style={[styles.timestampText, { color: Colors.textSecondary }]}>
                      {item.createdAt}
                    </AppText>
                    {!!item.appointmentId && (
                      <AppText variant="caption" style={[styles.viewAptLink, { color: Colors.primary }]}>
                        View Appointment →
                      </AppText>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
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
  readAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 30,
    gap: 10,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  notifCardUnread: {
    backgroundColor: 'rgba(255, 235, 238, 0.4)',
    borderWidth: 1.5,
    borderColor: 'rgba(211, 47, 47, 0.5)',
  },
  notifCardRead: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBodyCol: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 6,
  },
  notifMessage: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 11,
  },
  viewAptLink: {
    fontSize: 11,
    fontWeight: '700',
  },
});
