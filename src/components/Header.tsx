import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { usePetsHub } from '../context/PetsHubContext';

interface HeaderProps {
  onOpenNotifications?: () => void;
  onOpenSupabaseConfig?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenSupabaseConfig,
}) => {
  const { currentUser, logout, unreadNotificationCount, supabaseConfig } =
    usePetsHub();

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <View style={styles.topAppBar}>
      <View style={styles.leftRow}>
        <Image
          source={require('../../assets/petshub_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            {isAdmin ? 'ADMIN' : 'SIKAR'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {onOpenSupabaseConfig && (
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={onOpenSupabaseConfig}
            activeOpacity={0.7}
          >
            <Ionicons
              name={supabaseConfig.isLiveEnabled ? 'cloud-done' : 'cloud'}
              size={20}
              color="#FFFFFF"
            />
            <View
              style={[
                styles.cloudDot,
                {
                  backgroundColor: supabaseConfig.isLiveEnabled ? '#22C55E' : '#FBBF24',
                },
              ]}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionIconBtn}
          onPress={onOpenNotifications}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={21} color="#FFFFFF" />
          {unreadNotificationCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionIconBtn}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={21} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topAppBar: {
    height: 52,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    height: 30,
    width: 96,
  },
  roleBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  roleBadgeText: {
    color: Colors.primary,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cloudDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  notifBadgeText: {
    color: Colors.primary,
    fontSize: 8.5,
    fontWeight: '900',
  },
});
