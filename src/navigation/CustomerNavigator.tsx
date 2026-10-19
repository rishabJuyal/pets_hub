import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { Header } from '../components/Header';
import { CustomerHome } from '../screens/customer/CustomerHome';
import { BookAppointment } from '../screens/customer/BookAppointment';
import { MyAppointments } from '../screens/customer/MyAppointments';
import { CustomerShop } from '../screens/customer/CustomerShop';
import { CustomerNotifications } from '../screens/customer/CustomerNotifications';
import { CustomerProfile } from '../screens/customer/CustomerProfile';

const Tab = createBottomTabNavigator();

const renderTabLabel = (title: string) => ({ color }: { focused: boolean; color: string }) => (
  <Text
    style={{
      fontSize: 10,
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

export const CustomerNavigator: React.FC = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          header: ({ navigation }) => (
            <Header
              onOpenNotifications={() => navigation.navigate('Alerts')}
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
            shadowColor: '#000000',
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
            fontSize: 10,
            fontFamily: Fonts.semiBold,
            fontWeight: '600',
            marginTop: 2,
            marginBottom: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: renderTabLabel('Home'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        >
          {({ navigation }) => (
            <CustomerHome
              onNavigateToBook={() => navigation.navigate('Book')}
              onNavigateToAppointments={() => navigation.navigate('Visits')}
              onNavigateToShop={() => navigation.navigate('Shop')}
              onNavigateToAlerts={() => navigation.navigate('Alerts')}
              onNavigateToGallery={() => navigation.navigate('Gallery')}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Book"
          options={{
            tabBarLabel: renderTabLabel('Book'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        >
          {({ navigation }) => (
            <BookAppointment onBookingComplete={() => navigation.navigate('Visits')} />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Visits"
          options={{
            tabBarLabel: renderTabLabel('Visits'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'clipboard' : 'clipboard-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        >
          {({ navigation }) => (
            <MyAppointments onNavigateToBook={() => navigation.navigate('Book')} />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Shop"
          component={CustomerShop}
          options={{
            tabBarLabel: renderTabLabel('Shop'),
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
          name="Alerts"
          options={{
            tabBarLabel: renderTabLabel('Alerts'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        >
          {({ navigation }) => (
            <CustomerNotifications
              onNavigateToAppointment={() => navigation.navigate('Visits')}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Profile"
          component={CustomerProfile}
          options={{
            tabBarLabel: renderTabLabel('Profile'),
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
