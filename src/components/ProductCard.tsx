import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Badge } from './Badge';
import { Colors } from '../theme/colors';
import { Product } from '../types';

const CATEGORY_NAMES: Record<string, string> = {
  ALL: 'All Items',
  FOOD_TREATS: 'Food & Treats',
  TOYS_PLAY: 'Toys & Accessories',
  HEALTH_WELLNESS: 'Medicines & Health',
  GROOMING: 'Grooming & Care',
  ACCESSORIES: 'Accessories',
};

interface ProductCardProps {
  product: Product;
  isAdminView?: boolean;
  isAdmin?: boolean;
  onClick?: () => void;
  onPress?: () => void;
  onToggleStock?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdminView = false,
  isAdmin,
  onClick,
  onPress,
  onToggleStock,
  onEdit,
  onDelete,
}) => {
  const isActualAdmin = isAdmin ?? isAdminView;
  const handlePress = onClick || onPress;
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      <View style={styles.imageBox}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="bag-handle" size={40} color={Colors.primaryLight} />
        )}

        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={15}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsBox}>
        <AppText variant="caption" style={styles.categoryText} numberOfLines={1}>
          {CATEGORY_NAMES[product.category] || 'Food & Treats'}
        </AppText>

        <AppText variant="label" style={styles.nameText} numberOfLines={2}>
          {product.name}
        </AppText>

        <View style={styles.priceAndStockRow}>
          <AppText variant="h3" style={styles.priceText}>
            ₹{Math.round(product.price)}
          </AppText>

          <TouchableOpacity onPress={onToggleStock} activeOpacity={0.7}>
            <Badge
              variant={product.isAvailable ? 'confirmed' : 'low_stock'}
              label={product.isAvailable ? 'In Stock' : 'Low Stock'}
            />
          </TouchableOpacity>
        </View>

        {isActualAdmin ? (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.iconActionBtn}
              onPress={handlePress}
              activeOpacity={0.7}
            >
              <Ionicons name="cart-outline" size={15} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconActionBtn}
              onPress={onEdit}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={14} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconActionBtn}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.iconActionBtn, { flex: 1, backgroundColor: Colors.primaryContainer }]}
              onPress={handlePress}
              activeOpacity={0.7}
            >
              <Ionicons name="cart" size={14} color={Colors.primary} />
              <AppText variant="caption" style={{ color: Colors.primary, fontWeight: '700', marginLeft: 4 }}>
                Buy Now
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 8,
    marginBottom: 10,
    marginHorizontal: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  imageBox: {
    height: 115,
    width: '100%',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsBox: {
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  categoryText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 16,
    height: 32,
  },
  priceAndStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.primary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceSubtle,
  },
  iconActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.surfaceSubtle,
  },
});
