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
import { Button } from '../../components/Button';
import { AppText } from '../../components/AppText';
import { BroadcastModal } from '../../components/Modals/BroadcastModal';
import { AppNotification } from '../../types';

export const AdminNotifications: React.FC = () => {
  const { notifications, sendBroadcastNotification } = usePetsHub();
  const [showModal, setShowModal] = useState(false);

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
    <Screen scrollable={false}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <AppText variant="h2" style={styles.screenTitle}>
            Broadcast Alerts
          </AppText>
          <AppText variant="caption" style={styles.screenSubtitle}>
            Send announcements & vaccination camp updates across Sikar
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.broadcastBtn}
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="megaphone" size={14} color="#FFFFFF" />
          <AppText variant="button" style={styles.broadcastBtnText}>
            Broadcast
          </AppText>
        </TouchableOpacity>
      </View>

      <AppText variant="label" style={styles.historySectionTitle}>
        Dispatched History ({notifications.length})
      </AppText>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={40} color={Colors.textMuted} />
          <AppText variant="caption" style={styles.emptyText}>
            No dispatched notifications yet.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.notifCard}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={getIconName(item.type)}
                  size={16}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.cardBodyCol}>
                <View style={styles.cardHeaderRow}>
                  <AppText variant="label" style={styles.notifTitle}>
                    {item.title}
                  </AppText>
                  <AppText variant="caption" style={styles.timestampText}>
                    {item.createdAt}
                  </AppText>
                </View>

                <AppText variant="caption" style={styles.notifMessage}>
                  {item.message}
                </AppText>

                <AppText variant="caption" style={styles.targetTagText}>
                  Type: {item.type.replace('_', ' ')} • Target:{' '}
                  {item.type === 'ANNOUNCEMENT' ? 'All Owners' : `User (${item.userId})`}
                </AppText>
              </View>
            </View>
          )}
        />
      )}

      <BroadcastModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSend={sendBroadcastNotification}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleCol: {
    flex: 1,
    marginRight: 8,
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
  broadcastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 7,
    gap: 4,
  },
  broadcastBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  historySectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 40,
    gap: 8,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
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
    marginBottom: 3,
  },
  notifTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  notifMessage: {
    fontSize: 11.5,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  targetTagText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: Colors.primary,
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
