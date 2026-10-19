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
import { GALLERY_IMAGES, CATEGORY_LABELS, GalleryCategory } from '../../constants/gallery';

interface GalleryScreenProps {
  onClose?: () => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ onClose }) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const total = GALLERY_IMAGES.length;
  const currentImage = previewIndex != null ? GALLERY_IMAGES[previewIndex] : null;

  const isFavorited = (id: string) => !!favorited[id];
  const toggleFavorite = (id: string) => {
    setFavorited((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const goPrev = useCallback(() => setPreviewIndex((i) => (i != null && i > 0 ? i - 1 : i)), []);
  const goNext = useCallback(() => setPreviewIndex((i) => (i != null && i < total - 1 ? i + 1 : i)), []);
  const openPreview = (index: number) => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);

  return (
    <Screen
      scrollable={false}
      style={styles.page}
      contentContainerStyle={styles.screenWrapper}
    >
      {/* ================= FIXED TOP HEADER BAR WITH CLOSE BUTTON (TOP RIGHT) ================= */}
      <View style={styles.topAppBar}>
        <View style={styles.headerLeftCol}>
          <View style={styles.headerTitleRow}>
            <AppText variant="h2" style={styles.headerTitle}>
              Pet Gallery 🐾
            </AppText>
            <View style={styles.headerBadge}>
              <AppText variant="caption" style={styles.headerBadgeText}>
                {total} captures
              </AppText>
            </View>
          </View>
          <AppText variant="caption" style={styles.headerSubtitle}>
            Beautiful moments at Pet&apos;s Hub, Sikar
          </AppText>
        </View>

        {onClose && (
          <TouchableOpacity
            style={styles.topCloseBtn}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Refreshable scroll with reduced overall page padding */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* ================= 1ST FEATURED IMAGE (FULL WIDTH) ================= */}
        {total > 0 && (
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() => openPreview(0)}
            activeOpacity={0.92}
          >
            <Image source={GALLERY_IMAGES[0].uri} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.heroChip}>
                <AppText variant="caption" style={styles.chipText}>
                  {CATEGORY_LABELS[GALLERY_IMAGES[0].category as GalleryCategory]}
                </AppText>
              </View>
              <AppText variant="h2" style={styles.heroTitle}>
                {GALLERY_IMAGES[0].title}
              </AppText>
              <View style={styles.heroFooterRow}>
                <Ionicons name="image" size={12} color="#FFFFFF" />
                <AppText variant="caption" style={styles.heroMeta}>
                  Tap to view full screen
                </AppText>
              </View>
            </View>
            <TouchableOpacity
              style={styles.heroFavorite}
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(GALLERY_IMAGES[0].id);
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isFavorited(GALLERY_IMAGES[0].id) ? 'heart' : 'heart-outline'}
                size={16}
                color={isFavorited(GALLERY_IMAGES[0].id) ? '#FF4D4D' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* ================= 2-COLUMN GALLERY GRID (REMAINING IMAGES) ================= */}
        <View style={styles.gridWrap}>
          {GALLERY_IMAGES.slice(1).map((image, index) => {
            const actualIndex = index + 1;
            return (
              <TouchableOpacity
                key={image.id}
                style={styles.galleryCard}
                onPress={() => openPreview(actualIndex)}
                activeOpacity={0.88}
              >
                <Image source={image.uri} style={styles.galleryImage} resizeMode="cover" />
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
                  <View style={styles.cardChip}>
                    <AppText variant="caption" style={styles.chipText}>
                      {CATEGORY_LABELS[image.category as GalleryCategory]}
                    </AppText>
                  </View>
                  <AppText variant="label" style={styles.cardTitle} numberOfLines={1}>
                    {image.title}
                  </AppText>
                  <View style={styles.cardFooterRow}>
                    <Ionicons name="paw" size={10} color="#FFE5E8" />
                    <AppText variant="caption" style={styles.cardMeta} numberOfLines={1}>
                      Pet&apos;s Hub Sikar
                    </AppText>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.cardFavorite}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(image.id);
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isFavorited(image.id) ? 'heart' : 'heart-outline'}
                    size={14}
                    color={isFavorited(image.id) ? '#FF4D4D' : 'rgba(255,255,255,0.95)'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
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
              <Ionicons name="close" size={22} color={Colors.textWhite} />
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
                    size={20}
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
                  <Ionicons name="bookmark" size={16} color={Colors.textWhite} />
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
    flex: 1,
  },
  screenWrapper: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },

  /* Top App Bar with Close Button (Fixed Top-Right) */
  topAppBar: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeftCol: {
    flex: 1,
    marginRight: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 9.5,
    color: '#FFE5E8',
    marginTop: 2,
    lineHeight: 13,
  },
  topCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Hero 1st card (full width) */
  heroCard: {
    width: '100%',
    height: 185,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    backgroundColor: Colors.surfaceMuted,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '52%',
    backgroundColor: 'rgba(0,0,0,0.48)',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    justifyContent: 'flex-end',
    gap: 2,
  },
  heroChip: {
    backgroundColor: 'rgba(211,24,38,0.88)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  heroTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  heroMeta: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroFavorite: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  /* Grid cards */
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryCard: {
    width: '48.8%',
    height: 155,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 8,
    backgroundColor: Colors.surfaceMuted,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '52%',
    backgroundColor: 'rgba(0,0,0,0.48)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 7,
    justifyContent: 'flex-end',
    gap: 2,
  },
  cardChip: {
    backgroundColor: 'rgba(211,24,38,0.85)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 7.2,
    fontWeight: '800',
    letterSpacing: 0.2,
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 14,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardMeta: {
    fontSize: 7.5,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  cardFavorite: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 13,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  bottomSpacer: { height: 24 },

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
    top: -16,
    right: -16,
    zIndex: 20,
    backgroundColor: '#EF4444',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    maxWidth: '88%',
    maxHeight: '68%',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },

  /* Info sheet */
  infoSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
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
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  favSheetBtn: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    width: 38,
    height: 38,
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
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  pageDotActive: {
    width: 24,
    height: 7,
    backgroundColor: '#EF4444',
    borderRadius: 3.5,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#B91C1C',
    borderRadius: 14,
    paddingVertical: 11,
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
    fontSize: 12.5,
    fontWeight: '800',
    color: Colors.textWhite,
    letterSpacing: 0.3,
  },
});
