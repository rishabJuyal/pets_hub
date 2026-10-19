import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  isSelected?: boolean;
  onClick?: () => void;
  compactWidth?: number;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  isSelected = false,
  onClick,
  compactWidth,
}) => {
  const isCat = pet.species.toLowerCase() === 'cat';
  const circleBg = isCat ? Colors.rubyContainer : Colors.primaryContainer;
  const iconColor = isCat ? Colors.rubyAccent : Colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        compactWidth ? { width: compactWidth } : undefined,
        isSelected && styles.cardSelected,
      ]}
      onPress={onClick}
      activeOpacity={0.85}
    >
      <View style={styles.row}>
        <View style={[styles.avatarCircle, { backgroundColor: circleBg }]}>
          <Ionicons name="paw" size={24} color={iconColor} />
        </View>

        <View style={styles.textCol}>
          <AppText variant="label" style={[styles.name, { color: Colors.textPrimary }]}>
            {pet.name}
          </AppText>
          <AppText variant="caption" style={[styles.speciesBreed, { color: Colors.textSecondary }]}>
            {pet.species} • {pet.breed || `${pet.ageYears} yrs`}
          </AppText>
          {!!pet.medicalNotes && (
            <AppText variant="caption" style={[styles.medicalNotes, { color: Colors.primary }]}>
              Note: {pet.medicalNotes}
            </AppText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  speciesBreed: {
    fontSize: 12,
    marginTop: 2,
  },
  medicalNotes: {
    fontSize: 11,
    marginTop: 2,
  },
});
