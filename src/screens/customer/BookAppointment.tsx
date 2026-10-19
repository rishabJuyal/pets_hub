import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
import { AddPetModal } from '../../components/Modals/AddPetModal';

interface BookAppointmentProps {
  onBookingComplete: () => void;
}

const DATE_OPTIONS = ['Today', 'Tomorrow', 'In 2 Days', 'Saturday', 'Sunday'];
const TIME_OPTIONS_ROW1 = ['09:00 AM', '10:30 AM', '01:00 PM'];
const TIME_OPTIONS_ROW2 = ['03:00 PM', '04:30 PM', '06:00 PM'];

export const BookAppointment: React.FC<BookAppointmentProps> = ({ onBookingComplete }) => {
  const { customerPets, services, bookAppointment, addPet } = usePetsHub();

  const [selectedPetId, setSelectedPetId] = useState(customerPets[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [notes, setNotes] = useState('');
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  const activePetId = selectedPetId || customerPets[0]?.id || '';
  const activeServiceId = selectedServiceId || services[0]?.id || '';

  const handleBook = () => {
    if (activePetId && activeServiceId) {
      bookAppointment(activePetId, activeServiceId, selectedDate, selectedTime, notes);
      onBookingComplete();
    }
  };

  return (
    <Screen>
      <View style={styles.titleSection}>
        <AppText variant="h2" style={[styles.screenTitle, { color: Colors.textPrimary }]}>
          Book Care Appointment
        </AppText>
        <AppText variant="bodySmall" style={[styles.screenSubtitle, { color: Colors.primary }]}>
          Pet's Hub Sikar • Silver Jubilee Road, Near Rani Palace
        </AppText>
      </View>

      <AppText variant="label" style={[styles.stepTitle, { color: Colors.primary }]}>
        1. Choose Your Pet *
      </AppText>

      {customerPets.length === 0 ? (
        <Card padding={16} shadow="sm" style={styles.emptyPetsCard}>
          <AppText variant="caption" style={[styles.emptyPetsText, { color: Colors.textSecondary }]}>
            No pets added yet.
          </AppText>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={() => setShowAddPetModal(true)}
          >
            <AppText variant="caption" style={[styles.emptyAddBtnText, { color: '#FFFFFF' }]}>
              + Add Pet
            </AppText>
          </TouchableOpacity>
        </Card>
      ) : (
        <View style={styles.petsColumn}>
          {customerPets.map((pet) => {
            const isSelected = activePetId === pet.id;
            return (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petCard, isSelected && styles.petCardSelected]}
                onPress={() => setSelectedPetId(pet.id)}
                activeOpacity={0.85}
              >
                <View style={styles.petLeftRow}>
                  <View style={styles.petIconCircle}>
                    <Ionicons name="paw" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.petInfoCol}>
                    <AppText variant="label" style={[styles.petName, { color: Colors.textPrimary }]}>
                      {pet.name}
                    </AppText>
                    <AppText variant="caption" style={[styles.petBreed, { color: Colors.textSecondary }]}>
                      {pet.species} • {pet.breed || 'Companion'}
                    </AppText>
                  </View>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <AppText variant="label" style={[styles.stepTitle, { color: Colors.primary }]}>
        2. Select Service *
      </AppText>
      <View style={styles.servicesColumn}>
        {services.map((srv) => {
          const isSelected = activeServiceId === srv.id;
          return (
            <TouchableOpacity
              key={srv.id}
              style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
              onPress={() => setSelectedServiceId(srv.id)}
              activeOpacity={0.85}
            >
              <View style={styles.serviceTextCol}>
                <AppText variant="label" style={[styles.serviceTitle, { color: Colors.textPrimary }]}>
                  {srv.title}
                </AppText>
                <AppText variant="caption" style={[styles.serviceDesc, { color: Colors.textSecondary }]}>
                  {srv.description}
                </AppText>
                <AppText variant="caption" style={[styles.servicePrice, { color: Colors.primary }]}>
                  {srv.durationMinutes} min • ₹{Math.round(srv.price)}
                </AppText>
              </View>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <AppText variant="label" style={[styles.stepTitle, { color: Colors.primary }]}>
        3. Date & Available Time Slot *
      </AppText>

      <AppText variant="caption" style={[styles.subStepLabel, { color: Colors.textPrimary }]}>
        Select Day
      </AppText>
      <View style={styles.buttonGridRow}>
        {DATE_OPTIONS.map((opt) => {
          const isSelected = selectedDate === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
              onPress={() => setSelectedDate(opt)}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={[styles.pillBtnText, isSelected && styles.pillBtnTextSelected]}>
                {opt}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <AppText variant="caption" style={[styles.subStepLabel, { marginTop: 10, color: Colors.textPrimary }]}>
        Select Time
      </AppText>
      <View style={styles.buttonGridRow}>
        {TIME_OPTIONS_ROW1.map((opt) => {
          const isSelected = selectedTime === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
              onPress={() => setSelectedTime(opt)}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={[styles.pillBtnText, isSelected && styles.pillBtnTextSelected]}>
                {opt}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[styles.buttonGridRow, { marginTop: 6 }]}>
        {TIME_OPTIONS_ROW2.map((opt) => {
          const isSelected = selectedTime === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.pillBtn, isSelected && styles.pillBtnSelected]}
              onPress={() => setSelectedTime(opt)}
              activeOpacity={0.8}
            >
              <AppText variant="caption" style={[styles.pillBtnText, isSelected && styles.pillBtnTextSelected]}>
                {opt}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <AppText variant="label" style={[styles.stepTitle, { color: Colors.primary }]}>
        4. Special Notes & Instructions
      </AppText>
      <Input
        label="Notes"
        placeholder="E.g. Herbal shampoo, sensitive paws, medication routine..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.notesInput}
      />

      <Button
        title="Request Appointment"
        onPress={handleBook}
        disabled={!activePetId || !activeServiceId}
        fullWidth
        style={styles.submitBtn}
      />

      <AddPetModal
        visible={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onSave={(n, s, b, a, w, m) => {
          const newPet = addPet(n, s, b, a, w, m);
          setSelectedPetId(newPet.id);
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  screenSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 18,
  },
  emptyPetsCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyPetsText: {
    fontSize: 13,
  },
  emptyAddBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  emptyAddBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  petsColumn: {
    gap: 8,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  petCardSelected: {
    backgroundColor: 'rgba(255, 235, 238, 0.5)',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  petLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  petIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petInfoCol: {
    flex: 1,
  },
  petName: {
    fontSize: 14,
    fontWeight: '700',
  },
  petBreed: {
    fontSize: 12,
    marginTop: 2,
  },
  servicesColumn: {
    gap: 8,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceCardSelected: {
    backgroundColor: 'rgba(255, 235, 238, 0.5)',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  serviceTextCol: {
    flex: 1,
    marginRight: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  serviceDesc: {
    fontSize: 11,
    marginVertical: 2,
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: '700',
  },
  subStepLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonGridRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillBtnText: {
    fontSize: 11,
    fontWeight: '500',
  },
  pillBtnTextSelected: {
    fontWeight: '600',
    color: Colors.textWhite,
  },
  notesInput: {
    fontSize: 13,
    color: Colors.textPrimary,
    minHeight: 70,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  submitBtn: {
    marginTop: 24,
  },
});
