import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { usePetsHub, CLINIC_INFO } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { EmptyState } from '../../components/EmptyState';
import { AppText } from '../../components/AppText';
import { ProductCard } from '../../components/ProductCard';
import { Product, ProductCategory } from '../../types';

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'All Items', value: 'ALL' },
  { label: 'Dog & Cat Food', value: 'FOOD_TREATS' },
  { label: 'Grooming & Care', value: 'GROOMING' },
  { label: 'Medicines & Supplements', value: 'HEALTH_WELLNESS' },
  { label: 'Accessories', value: 'ACCESSORIES' },
  { label: 'Toys & Play', value: 'TOYS_PLAY' },
];

export const CustomerShop: React.FC = () => {
  const { products } = usePetsHub();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      prod.name.toLowerCase().includes(query) ||
      prod.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <Screen>
      <View style={styles.titleSection}>
        <AppText variant="h2" style={[styles.screenTitle, { color: Colors.textPrimary }]}>
          Pet Shop & Supplies
        </AppText>
        <AppText variant="bodySmall" style={[styles.screenSubtitle, { color: Colors.primary }]}>
          Available at Pet's Hub Counter, Silver Jubilee Road, Sikar
        </AppText>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={Colors.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Royal Canin, Drools, shampoo..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
        style={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <TouchableOpacity
              key={cat.value}
              style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat.value)}
              activeOpacity={0.8}
            >
              <AppText
                variant="caption"
                style={[styles.categoryText, isSelected && styles.categoryTextActive]}
              >
                {cat.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon="bag-handle"
          title="No products match your search."
          subtitle="Try a different category or keyword."
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isAdminView={false}
              onClick={() => setSelectedProduct(item)}
            />
          )}
        />
      )}

      {selectedProduct && (
        <Modal visible={!!selectedProduct} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                <View style={styles.modalHeaderRow}>
                  <AppText variant="label" style={[styles.modalCategory, { color: Colors.primary }]}>
                    {selectedProduct.category.replace('_', ' ')}
                  </AppText>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedProduct(null)}
                  >
                    <Ionicons name="close" size={20} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalImageBox}>
                  {selectedProduct.imageUrl ? (
                    <Image
                      source={{ uri: selectedProduct.imageUrl }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons name="bag-handle" size={56} color={Colors.primary} />
                  )}
                </View>

                <AppText variant="label" style={[styles.modalTitle, { color: Colors.textPrimary }]}>
                  {selectedProduct.name}
                </AppText>

                <View style={styles.modalPriceRow}>
                  <AppText variant="button" style={[styles.modalPrice, { color: Colors.primary }]}>
                    ₹{Math.round(selectedProduct.price)}
                  </AppText>
                  <View
                    style={[
                      styles.modalStockPill,
                      selectedProduct.isAvailable ? styles.inStockPill : styles.outOfStockPill,
                    ]}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.modalStockText,
                        selectedProduct.isAvailable ? styles.inStockText : styles.outOfStockText,
                      ]}
                    >
                      {selectedProduct.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </AppText>
                  </View>
                </View>

                <View style={styles.modalDivider} />

                <AppText variant="caption" style={[styles.modalSectionHeader, { color: Colors.textPrimary }]}>
                  About This Product
                </AppText>
                <AppText variant="caption" style={[styles.modalDescText, { color: Colors.textSecondary }]}>
                  {selectedProduct.description}
                </AppText>

                <View style={styles.modalCounterBox}>
                  <AppText variant="caption" style={[styles.modalCounterText, { color: Colors.primary }]}>
                    🐾 Available at Pet's Hub Counter (Silver Jubilee Rd, Sikar)
                  </AppText>
                  <AppText variant="caption" style={[styles.modalCounterSubtext, { color: Colors.textSecondary }]}>
                    Near Rani Palace, Kalyan Circle • Helpline: {CLINIC_INFO.phone}
                  </AppText>
                </View>

                <TouchableOpacity
                  style={styles.modalDoneBtn}
                  onPress={() => setSelectedProduct(null)}
                >
                  <AppText variant="caption" style={[styles.modalDoneBtnText, { color: '#FFFFFF' }]}>
                    Close
                  </AppText>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 14,
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  categoryScroll: {
    maxHeight: 40,
    marginBottom: 12,
  },
  categoryRow: {
    gap: 8,
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  columnWrapper: {
    gap: 10,
  },
  listContent: {
    paddingBottom: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '95%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalScroll: {
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalCategory: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalImageBox: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 235, 238, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 14,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalStockPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inStockPill: {
    backgroundColor: Colors.primaryContainer,
  },
  outOfStockPill: {
    backgroundColor: '#FFCDD2',
  },
  modalStockText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inStockText: {
    color: Colors.primary,
  },
  outOfStockText: {
    color: '#B71C1C',
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  modalSectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalDescText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  modalCounterBox: {
    backgroundColor: 'rgba(255, 235, 238, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalCounterText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCounterSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  modalDoneBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalDoneBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
