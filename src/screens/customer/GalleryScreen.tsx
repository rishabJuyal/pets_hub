import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  RefreshControl,
  type GestureResponderEvent,
  type ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { GALLERY_IMAGES, CATEGORY_COLORS, CATEGORY_LABELS, GalleryCategory } from '../../constants/gallery';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const ITEM_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - ITEM_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;
const HERO_HEIGHT = 260;

type CategoryKey = GalleryCategory | 'All';

interface GalleryScreenProps {
  onClose?: () => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ onClose }) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('All');
  const [refreshing, setRefreshing] = useState(false);

  const total = GALLERY_IMAGES.length;
  const currentImage = previewIndex != null ? GALLERY_IMAGES[previewIndex] : null;

  const isFavorited = (id: string) => !!favorited[id];
  const toggleFavorite = (id: string) => {
    setFavorited((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredImages = useMemo(
    () =>
      selectedCategory === 'All'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter((i) => i.category === selectedCategory),
    [selectedCategory],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const goPrev = useCallback(() => setPreviewIndex((i) => (i != null && i > 0 ? i - 1 : i)), []);
  const goNext = useCallback(() => setPreviewIndex((i) => (i != null && i < total - 1 ? i + 1 : i)), []);
  const openPreview = (index: number) => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);

  const categoryColor = (cat: GalleryCategory) => CATEGORY_COLORS[cat] ?? Colors.primary;

  const categoryList: CategoryKey[] = useMemo(
    () => (['All', 'Dogs', 'Cats', 'Clinic', 'Grooming', 'Boarding'] as CategoryKey[]),
    [],
  );

  const hasResults = filteredImages.length > 0;

  return (
    <Screen style={styles.page}>
      {/* Refreshable scroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* ================= HEADER ================= */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerBand}>
            <View style={styles.headerContent}>
              <View style={styles.headerTopRow}>
                <AppText variant="h2" style={[styles.headerTitle, { color: Colors.textWhite }]}>
                  Pet Gallery 🐾✨
                </AppText>
                <View style={styles.headerBadge}>
                  <AppText variant="caption" style={styles.headerBadgeText}>
                    {total} captures
                  </AppText>
                </View>
              </View>
              <AppText variant="bodySmall" style={[styles.headerSubtitle, { color: '#FFE5E8' }]}>
                Beautiful moments at Pet&apos;s Hub, Sikar
              </AppText>
              {onClose && (
                <TouchableOpacity style={styles.closeBandBtn} onPress={onClose} activeOpacity={0.7}>
                  <Ionicons name="close-outline" size={22} color={Colors.textWhite} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ================= CATEGORY CHIPS ================= */}
          <View style={styles.chipsSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
              style={styles.chipScroll}
            >
              {categoryList.map((cat) => {
                const isActive = selectedCategory === cat;
                const color = cat === 'All' ? Colors.primary : categoryColor(cat as GalleryCategory);
                const label = cat === 'All' ? 'All Moments' : CATEGORY_LABELS[cat as GalleryCategory];
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      isActive && styles.categoryPillActive,
                      isActive && { backgroundColor: color },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                    activeOpacity={0.85}
                  >
                    <AppText
                      variant="caption"
                      style={[
                        styles.categoryText,
                        isActive && styles.categoryTextActive,
                        isActive && { color: Colors.textWhite },
                      ]}
                    >
                      {label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
              {categoryList.length > 4 && (
                <View style={styles.scrollHint}>
                  <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/* ================= GALLERY GRID ================= */}
        {!hasResults ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyState}>
              <Ionicons name="image-outline" size={48} color={Colors.textMuted} />
              <AppText variant="label" style={styles.emptyTitle}>
                No moments here yet
              </AppText>
              <AppText variant="caption" style={styles.emptySubtitle}>
                Try another category — more captures coming soon!
              </AppText>
            </View>
          </View>
        ) : (
          <View>
            {/* Hero featured card (first image, full width) */}
            <TouchableOpacity
              style={styles.heroCard}
              onPress={() => openPreview(GALLERY_IMAGES.findIndex((i) => i.id === filteredImages[0].id))}
              activeOpacity={0.92}
            >
              <Image source={filteredImages[0].uri} style={styles.heroImage} resizeMode="cover" />
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <View style={styles.heroChip}>
                  <AppText variant="caption" style={[styles.chipText, { color: Colors.textWhite }]}>
                    {CATEGORY_LABELS[filteredImages[0].category as GalleryCategory]}
                  </AppText>
                </View>
                <AppText variant="h2" style={[styles.heroTitle, { color: Colors.textWhite }]}>
                  {filteredImages[0].title}
                </AppText>
                <View style={styles.heroFooterRow}>
                  <Ionicons name="image" size={16} color={Colors.textWhite} />
                  <AppText variant="caption" style={[styles.heroMeta, { color: '#F8F9FA' }]}>
                    Tap to view full screen
                  </AppText>
                </View>
              </View>
              <View style={styles.heroFavorite}>
                <Ionicons
                  name={isFavorited(filteredImages[0].id) ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorited(filteredImages[0].id) ? '#FF4D4D' : Colors.textWhite}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.gridWrap}>
              {filteredImages.slice(1).map((image, index) => {
                const actualIndex = GALLERY_IMAGES.findIndex((i) => i.id === image.id);
                return (
                  <TouchableOpacity
                    key={image.id}
                    style={[styles.galleryCard]}
                    onPress={() => openPreview(actualIndex)}
                    activeOpacity={0.88}
                  >
                    <Image source={image.uri} style={styles.galleryImage} resizeMode="cover" />
                    <View style={styles.cardOverlay} />
                    <View style={styles.cardContent}>
                      <View style={styles.cardChip}>
                        <AppText variant="caption" style={[styles.chipText, { color: Colors.textWhite }]}>
                          {CATEGORY_LABELS[image.category as GalleryCategory]}
                        </AppText>
                      </View>
                      <AppText variant="label" style={[styles.cardTitle, { color: Colors.textWhite }]}>
                        {image.title}
                      </AppText>
                      <View style={styles.cardFooterRow}>
                        <Ionicons name="paw" size={14} color="#FFE5E8" />
                        <AppText variant="caption" style={[styles.cardMeta, { color: '#F8F9FA' }]}>
                          Pet&apos;s Hub Sikar
                        </AppText>
                      </View>
                    </View>
                    <View style={styles.cardFavorite}>
                      <Ionicons
                        name={isFavorited(image.id) ? 'heart' : 'heart-outline'}
                        size={18}
                        color={isFavorited(image.id) ? '#FF4D4D' : 'rgba(255,255,255,0.9)'}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.bottomSpacer} />
          </View>
        )}
      </ScrollView>

      {/* ================= FULL-SCREEN PREVIEW MODAL ================= */}
      <Modal
        visible={previewIndex != null}
        animationType="fade"
        transparent
        onRequestClose={closePreview}
        hardwareAccelerated
      >
        <TouchableOpacity
          style={styles.modalRoot}
          onPress={closePreview}
          activeOpacity={1}
        >
          <View style={styles.modalBackdrop} />
          <TouchableOpacity
            style={styles.modalContent}
            onPress={(e: GestureResponderEvent) => e.stopPropagation()}
            activeOpacity={1}
          >
            {/* Close button */}
            <TouchableOpacity style={styles.modalClose} onPress={closePreview} activeOpacity={0.8}>
              <Ionicons name="close" size={26} color={Colors.textWhite} />
            </TouchableOpacity>

            {/* Image + navigation */}
            <View style={styles.previewWrapper}>
              <TouchableOpacity
                style={styles.navPrev}
                onPress={goPrev}
                disabled={previewIndex === 0}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={34}
                  color={previewIndex === 0 ? '#6B7280' : Colors.textWhite}
                />
              </TouchableOpacity>

              <Image
                source={currentImage?.uri as ImageSourcePropType}
                style={styles.previewImage}
                resizeMode="contain"
              />

              <TouchableOpacity
                style={styles.navNext}
                onPress={goNext}
                disabled={previewIndex === total - 1}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={34}
                  color={previewIndex === total - 1 ? '#6B7280' : Colors.textWhite}
                />
              </TouchableOpacity>
            </View>

            {/* Bottom info sheet */}
            <View style={styles.infoSheet}>
              <View style={styles.infoHeaderRow}>
                <View style={styles.infoMeta}>
                  <AppText variant="label" style={styles.infoCategoryLabel}>
                    {CATEGORY_LABELS[(currentImage?.category as GalleryCategory) ?? 'Dogs']}
                  </AppText>
                  <AppText variant="h2" style={[styles.infoTitle, { color: Colors.textPrimary }]}>
                    {currentImage?.title ?? ''}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={[styles.favSheetBtn, isFavorited(currentImage?.id ?? '') && styles.favSheetBtnActive]}
                  onPress={() => toggleFavorite(currentImage?.id ?? '')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isFavorited(currentImage?.id ?? '') ? 'heart' : 'heart-outline'}
                    size={22}
                    color={isFavorited(currentImage?.id ?? '') ? '#FF4D4D' : Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.pageIndicatorRow}>
                {GALLERY_IMAGES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.pageDot,
                      previewIndex === i && styles.pageDotActive,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  toggleFavorite(currentImage?.id ?? '');
                  setTimeout(() => {}, 1500);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.saveIconRow}>
                  <Ionicons name="bookmark" size={18} color={Colors.textWhite} />
                  <AppText variant="button" style={styles.saveText}>
                    {isFavorited(currentImage?.id ?? '') ? 'Saved to Album 🐾' : 'Add to Favorites'}
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  /* Page */
  page: {
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 0,
    alignItems: 'stretch',
  },

  /* Header */
  headerWrapper: {
    width: '100%',
  },
  headerBand: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: -16,
    marginTop: 0,
    marginBottom: 16,
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: {
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  headerBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.textWhite,
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 6,
    lineHeight: 15,
  },
  closeBandBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Category chips */
  chipsSection: {
    marginBottom: 2,
  },
  chipScroll: {
    paddingBottom: 2,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: 0,
    paddingVertical: 2,
    alignItems: 'center',
  },
  scrollHint: {
    marginLeft: 4,
    alignSelf: 'center',
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryPillActive: {
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  categoryTextActive: {},

  /* Grid */
  heroCard: {
    width: '100%',
    height: HERO_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
    gap: 8,
  },
  heroChip: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  chipText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  heroMeta: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroFavorite: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  /* Grid cards */
  gridWrap: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  cardContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 14,
    justifyContent: 'flex-end',
    gap: 6,
  },
  cardChip: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textWhite,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  cardFavorite: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  bottomSpacer: { height: 24 },

  /* Empty state */
  emptyWrapper: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },

  /* Modal */
  modalRoot: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.85)',
  },
  modalContent: {
    width: '100%',
    maxHeight: '92%',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: -14,
    right: -14,
    zIndex: 20,
    backgroundColor: Colors.primary,
    borderRadius: 26,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#000000',
  },
  previewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 6,
  },
  navPrev: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    zIndex: 15,
  },
  navNext: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    zIndex: 15,
  },
  previewImage: {
    maxWidth: '82%',
    maxHeight: '66%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },

  /* Info sheet */
  infoSheet: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoMeta: {
    flex: 1,
    marginRight: 10,
  },
  infoCategoryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  favSheetBtn: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favSheetBtnActive: {
    backgroundColor: '#FDE8E9',
    borderColor: Colors.primary,
  },
  pageIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  pageDotActive: {
    width: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryHover,
    borderRadius: 16,
    paddingVertical: 13,
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  saveIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textWhite,
    letterSpacing: 0.3,
  },
});
