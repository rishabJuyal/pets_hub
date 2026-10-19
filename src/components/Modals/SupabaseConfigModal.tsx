import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { SupabaseConfig } from '../../types';

interface SupabaseConfigModalProps {
  visible: boolean;
  config: SupabaseConfig;
  onClose: () => void;
  onSave: (url: string, key: string, isLiveEnabled: boolean) => void;
}

const SQL_SCHEMA = `-- PET'S HUB SUPABASE SCHEMA
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT DEFAULT '',
  age_years INT DEFAULT 1,
  weight_kg NUMERIC(4,1) DEFAULT 5.0,
  medical_notes TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  service_title TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(8,2) NOT NULL,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE
);`;

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  visible,
  config,
  onClose,
  onSave,
}) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isLiveEnabled, setIsLiveEnabled] = useState(false);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    setUrl(config.projectUrl);
    setKey(config.anonKey);
    setIsLiveEnabled(config.isLiveEnabled);
  }, [config, visible]);

  const handleSave = () => {
    onSave(url.trim(), key.trim(), isLiveEnabled);
    Alert.alert('Configuration Saved', 'Supabase backend settings updated.');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={styles.overlay}>
        {/* Backdrop that blocks touch/scroll passthrough to the background screen */}
        <View style={styles.backdrop} onTouchStart={() => {}} onTouchEnd={() => {}} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="cloud" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Supabase Backend</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Live Toggle */}
            <View style={styles.switchBox}>
              <View style={styles.switchTextCol}>
                <Text style={styles.switchTitle}>Enable Live Supabase Sync</Text>
                <Text style={styles.switchSubtitle}>
                  Connect with PostgreSQL cloud DB. When disabled, the app uses offline demo data.
                </Text>
              </View>
              <Switch
                value={isLiveEnabled}
                onValueChange={setIsLiveEnabled}
                trackColor={{ false: '#D1D5DB', true: Colors.primaryLight }}
                thumbColor={isLiveEnabled ? Colors.primary : '#F3F4F6'}
              />
            </View>

            {/* Project URL */}
            <Text style={styles.label}>Supabase Project URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Anon Key */}
            <Text style={styles.label}>Supabase Public Anon Key</Text>
            <TextInput
              style={styles.input}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={key}
              onChangeText={setKey}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />

            {/* Schema Script Dropdown */}
            <TouchableOpacity
              style={styles.sqlDropdownHeader}
              onPress={() => setShowSql(!showSql)}
              activeOpacity={0.7}
            >
              <Ionicons name="code-slash" size={16} color={Colors.primary} />
              <Text style={styles.sqlDropdownTitle}>
                {showSql ? 'Hide SQL Schema Script' : 'View PostgreSQL Schema Script'}
              </Text>
              <Ionicons
                name={showSql ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.primary}
              />
            </TouchableOpacity>

            {showSql && (
              <View style={styles.sqlCodeBox}>
                <Text style={styles.sqlCodeText}>{SQL_SCHEMA}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingVertical: 12,
  },
  switchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  switchTextCol: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  switchSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  sqlDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryContainer,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  sqlDropdownTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
    marginLeft: 8,
  },
  sqlCodeBox: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  sqlCodeText: {
    color: '#34D399',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
