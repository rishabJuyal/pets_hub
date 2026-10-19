import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { usePetsHub } from '../context/PetsHubContext';
import { Header } from '../components/Header';
import { SupabaseConfigModal } from '../components/Modals/SupabaseConfigModal';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { AdminAppointments } from '../screens/admin/AdminAppointments';
import { AdminProducts } from '../screens/admin/AdminProducts';
import { AdminNotifications } from '../screens/admin/AdminNotifications';

const Tab = createBottomTabNavigator();

const renderTabLabel = (title: string) => ({ color }: { focused: boolean; color: string }) => (
  <Text
    style={{
      fontSize: 10.5,
      fontFamily: Fonts.semiBold,
      fontWeight: '600',
      color,
      textAlign: 'center',
      marginTop: 2,
    }}
  >
    {title}
  </Text>
);

export const AdminNavigator: React.FC = () => {
  const { adminPendingCount, supabaseConfig, updateSupabaseConfig } = usePetsHub();
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          header: ({ navigation }) => (
            <Header
              onOpenNotifications={() => navigation.navigate('Broadcasts')}
              onOpenSupabaseConfig={() => setShowSupabaseModal(true)}
            />
          ),
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#8E8E93',
          tabBarIconSize: 20,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 68,
            paddingTop: 4,
            paddingBottom: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.04,
            shadowRadius: 3,
            elevation: 4,
          },
          tabBarItemStyle: {
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarLabelStyle: {
            fontSize: 10.5,
            fontFamily: Fonts.semiBold,
            fontWeight: '600',
            marginTop: 2,
            marginBottom: 0,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          options={{
            tabBarLabel: renderTabLabel('Dashboard'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        >
          {({ navigation }) => (
            <AdminDashboard
              onNavigateToAppointments={() => navigation.navigate('Bookings')}
              onNavigateToProducts={() => navigation.navigate('Products')}
              onNavigateToBroadcasts={() => navigation.navigate('Broadcasts')}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Bookings"
          component={AdminAppointments}
          options={{
            tabBarLabel: renderTabLabel('Bookings'),
            tabBarBadge: adminPendingCount > 0 ? adminPendingCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: Colors.primary,
              color: '#FFFFFF',
              fontSize: 9.5,
              fontWeight: '800',
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              lineHeight: 16,
            },
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Products"
          component={AdminProducts}
          options={{
            tabBarLabel: renderTabLabel('Products'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'bag-handle' : 'bag-handle-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Broadcasts"
          component={AdminNotifications}
          options={{
            tabBarLabel: renderTabLabel('Broadcasts'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'megaphone' : 'megaphone-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>

      <SupabaseConfigModal
        visible={showSupabaseModal}
        config={supabaseConfig}
        onClose={() => setShowSupabaseModal(false)}
        onSave={updateSupabaseConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
