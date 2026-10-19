import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Product, ProductCategory } from '../../types';

interface AddEditProductModalProps {
  visible: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: (
    name: string,
    description: string,
    imageUrl: string,
    category: ProductCategory,
    price: number,
    isAvailable: boolean
  ) => void;
}

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'Food & Treats', value: 'FOOD_TREATS' },
  { label: 'Grooming', value: 'GROOMING' },
  { label: 'Health & Care', value: 'HEALTH_WELLNESS' },
  { label: 'Accessories', value: 'ACCESSORIES' },
  { label: 'Toys & Play', value: 'TOYS_PLAY' },
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  visible,
  product,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<ProductCategory>('FOOD_TREATS');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setImageUrl(product.imageUrl);
      setCategory(product.category);
      setPrice(product.price.toString());
      setIsAvailable(product.isAvailable);
    } else {
      setName('');
      setDescription('');
      setImageUrl('');
      setCategory('FOOD_TREATS');
      setPrice('');
      setIsAvailable(true);
    }
  }, [product, visible]);

  const handleSave = () => {
    if (!name.trim() || !price) return;
    onSave(
      name.trim(),
      description.trim(),
      imageUrl.trim() || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60',
      category,
      parseFloat(price) || 0,
      isAvailable
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        {/* Backdrop that blocks touch/scroll passthrough to the background screen */}
        <View style={styles.backdrop} onTouchStart={() => {}} onTouchEnd={() => {}} />
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="bag-handle" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.title}>
                {product ? 'Edit Shop Product' : 'Add New Product'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Category */}
            <Text style={styles.label}>Product Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[styles.categoryPill, category === cat.value && styles.categoryPillActive]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text style={[styles.categoryText, category === cat.value && styles.categoryTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Product Name */}
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Royal Canin Maxi Adult Dog Food"
              value={name}
              onChangeText={setName}
            />

            {/* Price */}
            <Text style={styles.label}>Price in ₹ *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 750"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            {/* Image URL */}
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://... (or leave blank for default)"
              value={imageUrl}
              onChangeText={setImageUrl}
            />

            {/* Description */}
            <Text style={styles.label}>Description & Dosage/Usage</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Key ingredients, benefits, nutritional value, weight..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Stock Availability Toggle */}
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchTitle}>In Stock at Sikar Clinic</Text>
                <Text style={styles.switchSubtitle}>
                  {isAvailable ? 'Customers can view as Available' : 'Displays Out of Stock badge'}
                </Text>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: '#D1D5DB', true: Colors.primaryLight }}
                thumbColor={isAvailable ? Colors.primary : '#F3F4F6'}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, (!name.trim() || !price) && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!name.trim() || !price}
            >
              <Text style={styles.saveBtnText}>Save Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  headerRow: {
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
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  input: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  switchSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
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
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
