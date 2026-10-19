import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { usePetsHub, CLINIC_INFO } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';
import { AppText } from '../../components/AppText';
import { PetCard } from '../../components/PetCard';
import { AppointmentCard } from '../../components/AppointmentCard';
import { AddPetModal } from '../../components/Modals/AddPetModal';
import { AppointmentDetailsModal } from '../../components/Modals/AppointmentDetailsModal';
import { SupabaseConfigModal } from '../../components/Modals/SupabaseConfigModal';
import { Appointment } from '../../types';
import { GALLERY_PREVIEW } from '../../constants/gallery';
import { GalleryScreen } from './GalleryScreen';

interface CustomerHomeProps {
  onNavigateToBook: () => void;
  onNavigateToAppointments: () => void;
  onNavigateToShop: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToGallery?: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onNavigateToBook,
  onNavigateToAppointments,
  onNavigateToShop,
  onNavigateToAlerts,
  onNavigateToGallery,
}) => {
  const {
    currentUser,
    customerPets,
    customerAppointments,
    addPet,
    cancelCustomerAppointment,
    supabaseConfig,
    updateSupabaseConfig,
  } = usePetsHub();

  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  const nextUpcoming = customerAppointments.find(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );

  const onRateUsPress = () => {
    Linking.openURL(CLINIC_INFO.mapsUrl);
  };

  const handleOpenGallery = () => {
    setShowGalleryModal(true);
  };

  return (
    <Screen>
      <View style={styles.heroBox}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTextCol}>
            <AppText variant="h2" style={[styles.heroGreeting, { color: '#FFFFFF' }]}>
              Hello, {currentUser?.fullName || 'Pet Parent'} 👋
            </AppText>
            <AppText variant="bodySmall" style={[styles.heroSubtitle, { color: '#FFEBEE' }]}>
              Welcome to Pet's Hub Sikar — Trusted Veterinary & Pet Care
            </AppText>
          </View>
          <Image
            source={require('../../../assets/petshub_logo.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.locationHelplineStrip}>
          <View style={styles.stripLeft}>
            <Ionicons name="location" size={14} color="#FFFFFF" />
            <AppText variant="caption" style={[styles.stripTextLeft, { color: '#FFFFFF' }]}>
              Near Rani Palace, Kalyan Circle, Sikar
            </AppText>
          </View>
          <View style={styles.stripRight}>
            <Ionicons name="call" size={14} color="#FFFFFF" />
            <AppText variant="caption" style={[styles.stripTextRight, { color: '#FFFFFF' }]}>
              9672288833
            </AppText>
          </View>
        </View>

        <Button
          title="Book Clinic Appointment"
          icon={<Ionicons name="calendar" size={16} color={Colors.primary} />}
          onPress={onNavigateToBook}
          fullWidth
          style={styles.bookClinicBtn}
        />
      </View>

      <SectionHeader
        title="My Furry Family 🐾"
        actionTitle="+ Add Pet"
        onActionPress={() => setShowAddPetModal(true)}
      />

      {customerPets.length === 0 ? (
        <View style={styles.sectionGap}>
          <EmptyState
            icon="paw"
            title="No pets registered yet."
            subtitle="Add your first pet to book appointments."
            buttonTitle="Add Your First Pet"
            onPress={() => setShowAddPetModal(true)}
          />
        </View>
      ) : (
        <View style={styles.sectionGap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petsScrollContent}
          >
            {customerPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} compactWidth={220} />
            ))}
            <TouchableOpacity
              style={styles.newPetBox}
              onPress={() => setShowAddPetModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={22} color={Colors.primary} />
              <AppText variant="caption" style={[styles.newPetText, { color: Colors.primary }]}>
                New Pet
              </AppText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <SectionHeader
        title="Upcoming Care"
        actionTitle={`View All (${customerAppointments.length})`}
        onActionPress={onNavigateToAppointments}
      />

      {nextUpcoming ? (
        <View style={styles.sectionGap}>
          <AppointmentCard
            appointment={nextUpcoming}
            isAdminView={false}
            onClick={() => setSelectedApt(nextUpcoming)}
            onCancel={() =>
              cancelCustomerAppointment(nextUpcoming.id, 'Cancelled from home dashboard')
            }
          />
        </View>
      ) : (
        <View style={styles.sectionGap}>
          <EmptyState
            icon="calendar-outline"
            title="No appointments scheduled."
            buttonTitle="Book Now"
            onPress={onNavigateToBook}
          />
        </View>
      )}

      <View style={styles.servicesSection}>
        <AppText variant="h3" style={[styles.servicesTitle, { color: Colors.textPrimary }]}>
          Clinic Services (Sikar)
        </AppText>
        <View style={styles.servicesRow}>
          <TouchableOpacity
            style={styles.quickServiceCard}
            onPress={onNavigateToBook}
            activeOpacity={0.8}
          >
            <View style={styles.serviceCircle}>
              <Ionicons name="medical" size={20} color={Colors.primary} />
            </View>
            <AppText variant="label" style={[styles.serviceCardTitle, { color: Colors.textPrimary }]}>
              Vet Doctor
            </AppText>
            <AppText variant="caption" style={[styles.serviceCardPrice, { color: Colors.primary }]}>
              From ₹450
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickServiceCard}
            onPress={onNavigateToBook}
            activeOpacity={0.8}
          >
            <View style={styles.serviceCircle}>
              <Ionicons name="cut" size={20} color={Colors.primary} />
            </View>
            <AppText variant="label" style={[styles.serviceCardTitle, { color: Colors.textPrimary }]}>
              Grooming
            </AppText>
            <AppText variant="caption" style={[styles.serviceCardPrice, { color: Colors.primary }]}>
              From ₹850
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickServiceCard}
            onPress={onNavigateToBook}
            activeOpacity={0.8}
          >
            <View style={styles.serviceCircle}>
              <Ionicons name="home" size={20} color="#C62828" />
            </View>
            <AppText variant="label" style={[styles.serviceCardTitle, { color: Colors.textPrimary }]}>
              Boarding
            </AppText>
            <AppText variant="caption" style={[styles.serviceCardPrice, { color: Colors.primary }]}>
              From ₹700
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <SectionHeader
        title="Pet Gallery 🐾✨"
        subtitle="Cute moments from Pet&apos;s Hub, Sikar"
        actionTitle="View All Moments"
        onActionPress={handleOpenGallery}
      />

      <View style={styles.gallerySectionWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryPreviewContent}
        >
          {GALLERY_PREVIEW.map((image) => (
            <TouchableOpacity
              key={image.id}
              style={styles.galleryPreviewCard}
              onPress={handleOpenGallery}
              activeOpacity={0.88}
            >
              <Image source={image.uri} style={styles.galleryPreviewImage} resizeMode="cover" />
              <View style={styles.galleryPreviewOverlay} />
              <View style={styles.galleryPreviewBadge}>
                <AppText variant="caption" style={styles.galleryPreviewBadgeText}>
                  🐾
                </AppText>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.viewAllCard}
            onPress={handleOpenGallery}
            activeOpacity={0.8}
          >
            <View style={styles.viewAllContent}>
              <Ionicons name="image" size={20} color={Colors.primary} />
              <AppText variant="caption" style={styles.viewAllText}>
                View All Moments →
              </AppText>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <SectionHeader
        title="Love Pet's Hub?"
        subtitle="Rate us on Google Maps"
        actionTitle="Leave a Review"
        onActionPress={onRateUsPress}
      />

      <Card padding={12} shadow="sm" style={styles.rateCard}>
        <View style={styles.rateRow}>
          <View style={styles.rateIconContainer}>
            <Ionicons name="logo-google" size={20} color="#4285F4" />
          </View>
          <View style={styles.rateInfo}>
            <AppText variant="label" style={styles.rateTitle}>
              Rate Us on Google Maps
            </AppText>
            <View style={styles.rateMetaRow}>
              <View style={styles.rateStarsRow}>
                <Ionicons name="star" size={13} color={Colors.primary} />
                <Ionicons name="star" size={13} color={Colors.primary} />
                <Ionicons name="star" size={13} color={Colors.primary} />
                <Ionicons name="star" size={13} color={Colors.primary} />
                <Ionicons name="star" size={13} color="#E5E7EB" />
              </View>
              <AppText variant="caption" style={styles.rateReviewsText}>
                4.9 ★ • Google Reviews
              </AppText>
            </View>
          </View>
        </View>
        <AppText variant="bodySmall" style={styles.rateBody}>
          Help more pet parents find us — your review means a lot! ❤️
        </AppText>
        <Button
          title="Leave a Review"
          variant="primary"
          fullWidth
          style={styles.rateButton}
          onPress={onRateUsPress}
          icon={<Ionicons name="star" size={16} color={Colors.textWhite} />}
        />
      </Card>

      <AddPetModal
        visible={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onSave={addPet}
      />

      <AppointmentDetailsModal
        visible={!!selectedApt}
        appointment={selectedApt}
        onClose={() => setSelectedApt(null)}
        onCancel={(reason) =>
          selectedApt && cancelCustomerAppointment(selectedApt.id, reason)
        }
      />

      <SupabaseConfigModal
        visible={showSupabaseModal}
        config={supabaseConfig}
        onClose={() => setShowSupabaseModal(false)}
        onSave={updateSupabaseConfig}
      />

      <Modal
        visible={showGalleryModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowGalleryModal(false)}
      >
        <GalleryScreen onClose={() => setShowGalleryModal(false)} />
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroBox: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTextCol: {
    flex: 1,
    marginRight: 8,
  },
  heroGreeting: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  heroSubtitle: {
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  heroLogo: {
    width: 90,
    height: 34,
  },
  locationHelplineStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  stripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  stripTextLeft: {
    fontSize: 10,
    fontWeight: '500',
  },
  stripRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stripTextRight: {
    fontSize: 10,
    fontWeight: '700',
  },
  bookClinicBtn: {
    marginTop: 2,
  },
  petsScrollContent: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  newPetBox: {
    width: 130,
    height: 74,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  newPetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionGap: {
    marginBottom: 12,
  },
  servicesSection: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  servicesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickServiceCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  serviceCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  serviceCardPrice: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  rateCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  rateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateInfo: {
    flex: 1,
  },
  rateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  rateMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  rateStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  rateReviewsText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rateBody: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
    marginTop: 2,
    marginBottom: 12,
  },
  rateButton: {
    marginTop: 2,
    height: 44,
  },
  gallerySectionWrapper: {
    marginBottom: 12,
  },
  galleryPreviewContent: {
    gap: 12,
    paddingBottom: 16,
  },
  galleryPreviewCard: {
    width: 156,
    height: 156,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  galleryPreviewImage: {
    width: '100%',
    height: '100%',
  },
  galleryPreviewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  galleryPreviewBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  galleryPreviewBadgeText: {
    fontSize: 14,
  },
  viewAllCard: {
    width: 156,
    height: 156,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  viewAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
});
