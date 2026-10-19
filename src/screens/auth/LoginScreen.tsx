import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { usePetsHub } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { AppText } from '../../components/AppText';
import { SupabaseConfigModal } from '../../components/Modals/SupabaseConfigModal';

export const LoginScreen: React.FC = () => {
  const { login, register, loginDemo, supabaseConfig, updateSupabaseConfig } =
    usePetsHub();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSupabaseDialog, setShowSupabaseDialog] = useState(false);

  const handleSubmit = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      if (isRegisterMode) {
        const res = await register(fullName, email, password, phone, adminPasscode);
        if (!res.success) setAuthError(res.error || 'Registration failed');
      } else {
        const res = await login(email, password);
        if (!res.success) setAuthError(res.error || 'Invalid credentials');
      }
    } catch (e: any) {
      setAuthError(e?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.signboardSurface}>
          <Image
            source={require('../../../assets/petshub_logo.png')}
            style={styles.signboardLogo}
            resizeMode="contain"
          />
        </View>

        <AppText variant="label" style={styles.heroTagline}>
          Veterinary Clinic & Premium Pet Care
        </AppText>

        <View style={styles.locationRatingPill}>
          <Ionicons name="location" size={13} color={Colors.primary} />
          <AppText variant="caption" style={[styles.locationText, { color: Colors.primary }]}>
            Sikar, Rajasthan
          </AppText>
          <Ionicons name="star" size={13} color="#F59E0B" style={styles.starIcon} />
          <AppText variant="caption" style={[styles.ratingText, { color: Colors.primary }]}>
            4.9★
          </AppText>
        </View>

        <View style={styles.demoCard}>
          <AppText variant="caption" style={[styles.demoCardTitle, { color: Colors.primary }]}>
            Quick Demo Access (One-Tap)
          </AppText>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={styles.demoAdminBtn}
              onPress={() => loginDemo('ADMIN')}
              activeOpacity={0.8}
            >
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
              <AppText variant="caption" style={[styles.demoAdminText, { color: '#FFFFFF' }]}>
                Admin Demo
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoCustomerBtn}
              onPress={() => loginDemo('CUSTOMER')}
              activeOpacity={0.8}
            >
              <Ionicons name="paw" size={16} color={Colors.primary} />
              <AppText variant="caption" style={[styles.demoCustomerText, { color: Colors.primary }]}>
                Customer Demo
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <Card padding={20} shadow="sm" style={styles.formCard}>
          <AppText variant="h2" style={[styles.formTitle, { color: Colors.textPrimary }]}>
            {isRegisterMode ? 'Create Account' : 'Sign In'}
          </AppText>
          <AppText variant="bodySmall" style={[styles.formSubtitle, { color: Colors.textSecondary }]}>
            {isRegisterMode
              ? 'Register for clinic visits and supplies'
              : "Access your pets' health history & bookings"}
          </AppText>

          {authError ? (
            <View style={styles.errorBox}>
              <AppText variant="caption" style={[styles.errorText, { color: Colors.danger }]}>
                {authError}
              </AppText>
            </View>
          ) : null}

          {isRegisterMode && (
            <Input
              label="Full Name"
              leftIcon="person"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
          )}

          <Input
            label="Email Address"
            leftIcon="mail"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Password"
            leftIcon="lock-closed"
            rightIcon={passwordVisible ? 'eye-off' : 'eye'}
            onRightIconPress={() => setPasswordVisible(!passwordVisible)}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />

          {isRegisterMode && (
            <>
              <Input
                label="Phone Number"
                leftIcon="call"
                placeholder="+91 98290XXXXX"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <Input
                label="Admin Passcode (Clinic Staff Only)"
                leftIcon="key"
                placeholder="Enter staff code if clinic doctor"
                value={adminPasscode}
                onChangeText={setAdminPasscode}
              />
            </>
          )}

          <Button
            title={isRegisterMode ? 'Register Account' : 'Sign In'}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            style={styles.submitBtn}
          />

          <View style={styles.toggleRow}>
            <AppText variant="caption" style={[styles.toggleNormal, { color: Colors.textSecondary }]}>
              {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
            </AppText>
            <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)}>
              <AppText variant="caption" style={[styles.toggleBold, { color: Colors.primary }]}>
                {isRegisterMode ? 'Sign In' : 'Sign Up'}
              </AppText>
            </TouchableOpacity>
          </View>
        </Card>

        <Button
          title={
            supabaseConfig.isLiveEnabled
              ? 'Supabase Live Connected'
              : 'Configure Supabase Backend & Schema'
          }
          variant="outline"
          onPress={() => setShowSupabaseDialog(true)}
          fullWidth
          style={styles.supabaseBtn}
        />
      </ScrollView>

      <SupabaseConfigModal
        visible={showSupabaseDialog}
        config={supabaseConfig}
        onClose={() => setShowSupabaseDialog(false)}
        onSave={updateSupabaseConfig}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 36,
    alignItems: 'center',
  },
  signboardSurface: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  signboardLogo: {
    width: '90%',
    height: 72,
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  locationRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  starIcon: {
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
  demoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  demoCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoAdminBtn: {
    flex: 1,
    height: 38,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  demoAdminText: {
    fontSize: 12,
    fontWeight: '600',
  },
  demoCustomerBtn: {
    flex: 1,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  demoCustomerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formCard: {
    width: '100%',
    marginTop: 18,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  formSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  errorBox: {
    backgroundColor: Colors.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  toggleNormal: {
    fontSize: 13,
  },
  toggleBold: {
    fontSize: 13,
    fontWeight: '700',
  },
  supabaseBtn: {
    width: '100%',
    marginTop: 18,
  },
});
