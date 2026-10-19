import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { usePetsHub, CLINIC_INFO } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppText } from '../../components/AppText';
import { PetCard } from '../../components/PetCard';
import { AddPetModal } from '../../components/Modals/AddPetModal';
import { SupabaseConfigModal } from '../../components/Modals/SupabaseConfigModal';

export const CustomerProfile: React.FC = () => {
  const {
    currentUser,
    customerPets,
    addPet,
    logout,
    supabaseConfig,
    updateSupabaseConfig,
  } = usePetsHub();

  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  const handleCallClinic = () => {
    Linking.openURL(`tel:${CLINIC_INFO.phoneRaw}`);
  };

  return (
    <Screen>
      <AppText variant="h2" style={[styles.screenTitle, { color: Colors.textPrimary }]}>
        My Profile
      </AppText>
      <AppText variant="bodySmall" style={[styles.screenSubtitle, { color: Colors.textSecondary }]}>
        Manage your contact info & registered pets
      </AppText>

      <Card padding={20} shadow="sm" style={styles.profileAvatarCard}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={36} color={Colors.primary} />
        </View>
        <AppText variant="label" style={[styles.userName, { color: Colors.textPrimary }]}>
          {currentUser?.fullName || 'Pet Parent'}
        </AppText>
        <AppText variant="caption" style={[styles.userRoleSubtitle, { color: Colors.primary }]}>
          Customer Account • Pet's Hub Sikar Member
        </AppText>

        <View style={styles.avatarDivider} />

        <View style={styles.contactRow}>
          <Ionicons name="mail" size={18} color={Colors.primary} />
          <AppText variant="caption" style={[styles.contactText, { color: Colors.textPrimary }]}>
            {currentUser?.email || 'alex@petshub.com'}
          </AppText>
        </View>

        {!!currentUser?.phone && (
          <View style={[styles.contactRow, { marginTop: 10 }]}>
            <Ionicons name="call" size={18} color={Colors.primary} />
            <AppText variant="caption" style={[styles.contactText, { color: Colors.textPrimary }]}>
              {currentUser.phone}
            </AppText>
          </View>
        )}
      </Card>

      <TouchableOpacity
        style={styles.clinicCard}
        onPress={handleCallClinic}
        activeOpacity={0.88}
      >
        <View style={styles.clinicTopRow}>
          <AppText variant="label" style={[styles.clinicTitle, { color: Colors.primary }]}>
            Pet's Hub Sikar Clinic
          </AppText>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <AppText variant="caption" style={[styles.ratingText, { color: Colors.primary }]}>
              4.9 Rating
            </AppText>
          </View>
        </View>

        <View style={styles.clinicDetailRow}>
          <Ionicons name="location" size={14} color={Colors.primary} />
          <AppText variant="caption" style={[styles.clinicAddress, { color: Colors.textPrimary }]}>
            Silver Jubilee Road, Near Rani Palace, Sikar - 332001
          </AppText>
        </View>

        <View style={styles.clinicDetailRow}>
          <Ionicons name="call" size={14} color={Colors.primary} />
          <AppText variant="caption" style={[styles.clinicPhone, { color: Colors.textPrimary, fontWeight: '700' }]}>
            +91 9672288833, 6375951336
          </AppText>
        </View>
      </TouchableOpacity>

      <View style={styles.petsSectionHeader}>
        <AppText variant="h3" style={[styles.petsSectionTitle, { color: Colors.textPrimary }]}>
          Registered Pets ({customerPets.length})
        </AppText>
        <Button
          title="Add Pet"
          variant="primary"
          onPress={() => setShowAddPetModal(true)}
          style={styles.addPetButton}
        />
      </View>

      {customerPets.length === 0 ? (
        <View style={styles.emptyPetsCard}>
          <Ionicons name="paw" size={32} color={Colors.textMuted} />
          <AppText variant="caption" style={[styles.emptyPetsText, { color: Colors.textSecondary }]}>
            No pets added yet.
          </AppText>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={() => setShowAddPetModal(true)}
          >
            <AppText variant="caption" style={[styles.emptyAddBtnText, { color: Colors.primary }]}>
              Add Your First Pet
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.petsColumn}>
          {customerPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </View>
      )}

      <Card padding={16} shadow="sm" style={styles.supabaseCard}>
        <View style={styles.supabaseHeaderRow}>
          <Ionicons name="cloud" size={20} color={Colors.primary} />
          <AppText variant="label" style={[styles.supabaseTitle, { color: Colors.textPrimary }]}>
            Supabase Cloud Database
          </AppText>
        </View>
        <AppText variant="caption" style={[styles.supabaseDesc, { color: Colors.textSecondary }]}>
          {supabaseConfig.isLiveEnabled
            ? 'Connected to live Supabase backend.'
            : 'Currently using reactive in-memory database. Click to connect your Supabase project URL and Anon key.'}
        </AppText>
        <Button
          title="Supabase Settings & Schema"
          variant="outline"
          onPress={() => setShowSupabaseModal(true)}
          style={styles.supabaseSettingsBtn}
        />
      </Card>

      <Button
        title="Log Out"
        variant="danger"
        icon={<Ionicons name="log-out" size={18} color="#FFFFFF" />}
        onPress={logout}
        fullWidth
        style={styles.logoutButton}
      />

      <AddPetModal
        visible={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onSave={addPet}
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
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 20,
  },
  profileAvatarCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  userRoleSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
  avatarDivider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  contactText: {
    fontSize: 13,
  },
  clinicCard: {
    backgroundColor: 'rgba(255, 235, 238, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  clinicTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  clinicTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  clinicDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clinicAddress: {
    fontSize: 12,
  },
  clinicPhone: {
    fontSize: 12,
  },
  petsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  petsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  addPetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 38,
  },
  petsColumn: {
    gap: 8,
    marginBottom: 24,
  },
  emptyPetsCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 6,
  },
  emptyPetsText: {
    fontSize: 13,
  },
  emptyAddBtn: {
    marginTop: 4,
  },
  emptyAddBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  supabaseCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  supabaseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  supabaseTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  supabaseDesc: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  supabaseSettingsBtn: {
    paddingVertical: 10,
    height: 38,
  },
  logoutButton: {
    marginTop: 10,
  },
});
