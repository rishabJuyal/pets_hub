import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { usePetsHub } from '../../context/PetsHubContext';
import { Screen } from '../../components/Screen';
import { AppText } from '../../components/AppText';
import { ProductCard } from '../../components/ProductCard';
import { Product, ProductCategory } from '../../types';
import { AddEditProductModal } from '../../components/Modals/AddEditProductModal';

const CATEGORIES: { label: string; value: ProductCategory | 'ALL' }[] = [
  { label: 'All Items', value: 'ALL' },
  { label: 'Dog Food', value: 'FOOD_TREATS' },
  { label: 'Grooming & Care', value: 'GROOMING' },
  { label: 'Medicines', value: 'HEALTH_WELLNESS' },
  { label: 'Accessories', value: 'ACCESSORIES' },
  { label: 'Toys & Play', value: 'TOYS_PLAY' },
];

export const AdminProducts: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
  } = usePetsHub();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      prod.name.toLowerCase().includes(query) ||
      prod.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (prod: Product) => {
    Alert.alert(
      'Delete Product?',
      `Are you sure you want to remove "${prod.name}" from Pet's Hub catalog? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(prod.id);
            if (viewingProduct?.id === prod.id) {
              setViewingProduct(null);
            }
          },
        },
      ]
    );
  };

  return (
    <Screen scrollable={false}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <AppText variant="h2" style={styles.screenTitle}>
          Pet Shop Inventory
        </AppText>
        <AppText variant="caption" style={styles.screenSubtitle}>
          Manage pet food, care products, toys and more
        </AppText>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={Colors.primary} />
          <TextInput
            placeholder="Search products, brands, categories..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setSelectedCategory('ALL')}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={18} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
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
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          showPromoBanner && selectedCategory === 'ALL' && !searchQuery ? (
            <View style={styles.bannerCard}>
              <View style={styles.bannerTextCol}>
                <AppText variant="label" style={styles.bannerTitle}>
                  Healthy Pets{'\n'}Happier Lives ❤️
                </AppText>
                <AppText variant="caption" style={styles.bannerSubtitle}>
                  Quality products for your furry friends
                </AppText>
                <TouchableOpacity
                  style={styles.bannerBtn}
                  onPress={() => {
                    setEditingProduct(null);
                    setShowModal(true);
                  }}
                  activeOpacity={0.8}
                >
                  <AppText variant="caption" style={styles.bannerBtnText}>
                    Add New Product →
                  </AppText>
                </TouchableOpacity>
              </View>

              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80',
                }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-handle-outline" size={40} color={Colors.textMuted} />
            <AppText variant="caption" style={styles.emptyTitle}>
              No products found in this category.
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isAdminView={true}
            onClick={() => setViewingProduct(item)}
            onEdit={() => {
              setEditingProduct(item);
              setShowModal(true);
            }}
            onDelete={() => handleDelete(item)}
            onToggleStock={() => toggleProductAvailability(item.id)}
          />
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingProduct(null);
          setShowModal(true);
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Product Details Quick View Modal */}
      {viewingProduct && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalHeaderRow}>
                <AppText variant="caption" style={styles.modalCategory}>
                  {viewingProduct.category.replace('_', ' ')}
                </AppText>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setViewingProduct(null)}
                >
                  <Ionicons name="close" size={19} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalImageBox}>
                {viewingProduct.imageUrl ? (
                  <Image
                    source={{ uri: viewingProduct.imageUrl }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="bag-handle" size={50} color={Colors.primary} />
                )}
              </View>

              <AppText variant="label" style={styles.modalTitle}>
                {viewingProduct.name}
              </AppText>

              <View style={styles.modalPriceRow}>
                <AppText variant="h2" style={styles.modalPrice}>
                  ₹{Math.round(viewingProduct.price)}
                </AppText>
                <View
                  style={[
                    styles.modalStockPill,
                    viewingProduct.isAvailable ? styles.inStockPill : styles.outOfStockPill,
                  ]}
                >
                  <AppText
                    variant="caption"
                    style={[
                      styles.modalStockText,
                      viewingProduct.isAvailable ? styles.inStockText : styles.outOfStockText,
                    ]}
                  >
                    {viewingProduct.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </AppText>
                </View>
              </View>

              <View style={styles.modalDivider} />

              <AppText variant="caption" style={styles.modalSectionHeader}>
                About This Product
              </AppText>
              <AppText variant="caption" style={styles.modalDescText}>
                {viewingProduct.description}
              </AppText>

              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    const prod = viewingProduct;
                    setViewingProduct(null);
                    setEditingProduct(prod);
                    setShowModal(true);
                  }}
                >
                  <Ionicons name="pencil" size={15} color="#FFFFFF" />
                  <AppText variant="caption" style={styles.editBtnText}>
                    Edit Product
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(viewingProduct)}
                >
                  <Ionicons name="trash-outline" size={15} color={Colors.primary} />
                  <AppText variant="caption" style={styles.deleteBtnText}>
                    Delete
                  </AppText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Add / Edit Product Modal */}
      <AddEditProductModal
        visible={showModal}
        product={editingProduct}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        onSave={(name, desc, img, cat, price, stock) => {
          if (editingProduct) {
            updateProduct({
              ...editingProduct,
              name,
              description: desc,
              imageUrl: img,
              category: cat,
              price,
              isAvailable: stock,
            });
          } else {
            addProduct(name, desc, img, cat, price, stock);
          }
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 38,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 11.5,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  filterBtn: {
    width: 38,
    height: 38,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScrollContainer: {
    marginBottom: 10,
  },
  categoryRow: {
    gap: 7,
    alignItems: 'center',
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#374151',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  bannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  bannerSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  bannerBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bannerImage: {
    width: 86,
    height: 70,
    borderRadius: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '95%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalScroll: {
    padding: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalCategory: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalImageBox: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  modalStockPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  inStockPill: {
    backgroundColor: Colors.primaryContainer,
  },
  outOfStockPill: {
    backgroundColor: '#FEE2E2',
  },
  modalStockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  inStockText: {
    color: Colors.primary,
  },
  outOfStockText: {
    color: '#B91C1C',
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 10,
  },
  modalSectionHeader: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  modalDescText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flex: 1,
    height: 38,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deleteBtn: {
    flex: 1,
    height: 38,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
