import { useMemo, useRef, useState } from 'react';
import { Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  CameraSwapIcon,
  CloseIcon,
  Docent,
  docentFromLook,
  FlashIcon,
  GalleryIcon,
  LensTimesIcon,
  Popup,
  PopupButtons,
  ShutterIcon,
} from '../../components/ui';
import { useCaptureSession } from '../../lib/capture-session';
import { useLifelist } from '../../lib/lifelist-store';
import { normalizeWebImage } from '../../lib/photos';
import { absoluteFill, colors, fonts, spacing, type } from '../../lib/theme';

// expo-camera's `zoom` is a 0-1 fraction of the device's max zoom, not a
// scale factor, so a pinch has to be mapped into that range by hand.
const PINCH_SENSITIVITY = 0.5;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// Flash and torch are separate props, but they are one decision to the user:
// "how much light do I want?". One button cycles the whole range.
type LightMode = 'off' | 'auto' | 'on' | 'torch';
const LIGHT_CYCLE: LightMode[] = ['off', 'auto', 'on', 'torch'];
const LIGHT_LABEL: Record<LightMode, string> = {
  off: 'Off',
  auto: 'Auto',
  on: 'On',
  torch: 'Torch',
};

/**
 * The lens switcher's buttons (Figma "lens-buttons" 88384:3824). iOS reports
 * each physical lens by its English device name; "1×" is the default camera.
 * A lens the phone doesn't have (or Android, which reports none) just leaves
 * its button out.
 */
type Lens = { label: string; device: string | undefined };

function lensesFor(available: string[]): Lens[] {
  const find = (word: string) => available.find((name) => name.includes(word));
  const ultraWide = find('Ultra Wide');
  const telephoto = find('Telephoto');
  return [
    ...(ultraWide ? [{ label: '0.5', device: ultraWide }] : []),
    { label: '1', device: undefined },
    ...(telephoto ? [{ label: '3', device: telephoto }] : []),
  ];
}

/** Figma Capture-Camera-ON 88384:3811. */
export default function CaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setPhoto } = useCaptureSession();
  const { entries, profile } = useLifelist();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [taking, setTaking] = useState(false);
  const [ready, setReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [light, setLight] = useState<LightMode>('off');
  const [zoom, setZoom] = useState(0);
  const zoomStart = useRef(0);
  const [availableLenses, setAvailableLenses] = useState<string[]>([]);
  const [lens, setLens] = useState<string | undefined>(undefined);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const lenses = useMemo(() => lensesFor(availableLenses), [availableLenses]);

  // The gallery button shows the latest capture, as a photo app does.
  const latestPhoto = useMemo(
    () => [...entries].sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt)).find((e) => e.photoUri)?.photoUri,
    [entries],
  );

  // `.runOnJS(true)` keeps these callbacks on the JS thread: they only set
  // React state, so there is nothing for a worklet to do here.
  const pinch = Gesture.Pinch()
    .runOnJS(true)
    .onBegin(() => {
      zoomStart.current = zoom;
    })
    .onUpdate((event) => {
      setZoom(clamp(zoomStart.current + (event.scale - 1) * PINCH_SENSITIVITY));
    });

  // Animals move. Getting back to a wide shot has to be one gesture, not a
  // careful reverse pinch.
  const resetZoom = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(() => setZoom(0));

  const gesture = Gesture.Simultaneous(pinch, resetZoom);

  const close = () => router.dismissTo('/');

  async function handleShoot() {
    if (!cameraRef.current || taking || !ready) return;
    setTaking(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: true });
      if (photo?.uri && photo.base64) {
        setPhoto(photo.uri, photo.base64);
        router.push('/capture/identify');
      }
    } finally {
      setTaking(false);
    }
  }

  function handleFlip() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    // Zoom, lens and torch all belong to the side we are leaving behind.
    setZoom(0);
    setLens(undefined);
    setLight('off');
  }

  function handleLens(device: string | undefined) {
    setLens(device);
    setZoom(0);
  }

  function handleCycleLight() {
    setLight((current) => LIGHT_CYCLE[(LIGHT_CYCLE.indexOf(current) + 1) % LIGHT_CYCLE.length]);
  }

  async function handleUpload() {
    setUploadError(null);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      base64: true,
    });
    const asset = result.assets?.[0];
    if (result.canceled || !asset?.base64) return;

    // The web picker hands back whatever bytes the file has, unconverted —
    // including formats like HEIC that OpenAI's vision API rejects. The
    // native picker always re-encodes to JPEG, so only web needs this.
    if (Platform.OS === 'web') {
      try {
        const normalized = await normalizeWebImage(asset.uri);
        setPhoto(normalized.uri, normalized.base64);
        router.push('/capture/identify');
      } catch {
        setUploadError("That photo format isn't supported here. Try a different photo, or take one with the camera.");
      }
      return;
    }

    setPhoto(asset.uri, asset.base64);
    router.push('/capture/identify');
  }

  if (!permission) {
    return <View style={styles.safe} />;
  }

  if (!permission.granted) {
    // Once refused for good, only the Settings app can turn the camera back on.
    const blocked = !permission.canAskAgain;
    return (
      <View style={styles.safe}>
        <StatusBar style="light" />
        <Popup visible onClose={close}>
          <Docent animal={docentFromLook(profile.look)} width={112} />
          <View style={styles.popupText}>
            <Text style={[type.headingM, styles.center]} accessibilityRole="header">
              Camera access needed
            </Text>
            <Text style={[type.bodySm, styles.muted, styles.center]}>
              {blocked
                ? 'Turn on the camera for WildPack in Settings to photograph wildlife, or pick a photo you already have.'
                : 'I need your camera to photograph wildlife for your life list. You can also pick a photo you already have.'}
            </Text>
          </View>
          {uploadError && <Text style={[type.bodySm, styles.errorText]}>{uploadError}</Text>}
          <PopupButtons>
            <Button label="Choose photo" variant="outline" size="compact" onPress={handleUpload} style={styles.flex} />
            <Button
              label={blocked ? 'Open Settings' : 'Allow Camera'}
              size="compact"
              onPress={blocked ? () => Linking.openSettings() : requestPermission}
              style={styles.flex}
            />
          </PopupButtons>
        </Popup>
      </View>
    );
  }

  const lightOn = light !== 'off';

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />
      <GestureDetector gesture={gesture}>
        <View style={StyleSheet.absoluteFill}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            zoom={zoom}
            flash={light === 'torch' ? 'off' : light}
            enableTorch={light === 'torch'}
            selectedLens={lens}
            onAvailableLensesChanged={({ lenses: names }) => setAvailableLenses(names)}
            onCameraReady={() => setReady(true)}
          />
          {/* Figma darkens the lower half so the controls read over any scene. */}
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.4)']}
            locations={[0.4, 0.8]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </GestureDetector>

      {/* box-none throughout: the overlay must never swallow the pinch. */}
      <View style={[styles.topBar, { top: insets.top + 12 }]} pointerEvents="box-none">
        <Pressable
          style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
          onPress={close}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Close camera"
        >
          <CloseIcon color={colors.textOnPrimary} size={20} strokeWidth={2} />
        </Pressable>

        {/* Front cameras have no torch and no usable flash, so the control
            would be dead weight there. */}
        {facing === 'back' && (
          <View style={styles.lightGroup} pointerEvents="box-none">
            {lightOn && (
              <View style={styles.lightLabel} pointerEvents="none">
                <Text style={styles.lightLabelText}>{LIGHT_LABEL[light]}</Text>
              </View>
            )}
            <Pressable
              style={({ pressed }) => [styles.roundButton, lightOn && styles.roundButtonActive, pressed && styles.pressed]}
              onPress={handleCycleLight}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Flash: ${LIGHT_LABEL[light]}. Tap to change`}
            >
              <FlashIcon />
            </Pressable>
          </View>
        )}
      </View>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, spacing.screen) }]} pointerEvents="box-none">
        {uploadError && (
          <View style={styles.uploadErrorPill} pointerEvents="none">
            <Text style={styles.uploadErrorPillText}>{uploadError}</Text>
          </View>
        )}

        {facing === 'back' && (
          <View style={styles.lensRow}>
            {lenses.map(({ label, device }) => {
              const selected = device === lens;
              return (
                <Pressable
                  key={label}
                  onPress={() => handleLens(device)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${label} times lens`}
                  style={[styles.lens, selected && styles.lensSelected]}
                >
                  {selected ? (
                    <View style={styles.lensSelectedLabel}>
                      <Text style={styles.lensSelectedText}>{label}</Text>
                      <LensTimesIcon />
                    </View>
                  ) : (
                    <Text style={styles.lensText}>{label}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.shutter, pressed && styles.pressed, (taking || !ready) && styles.shutterBusy]}
          onPress={handleShoot}
          disabled={taking || !ready}
          accessibilityRole="button"
          accessibilityLabel="Take photo"
        >
          <ShutterIcon />
        </Pressable>

        <View style={styles.bottomRow} pointerEvents="box-none">
          <Pressable
            onPress={handleUpload}
            style={({ pressed }) => [styles.gallery, styles.roundOutline, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Choose a photo from your library"
          >
            {/* The icon stays underneath, so a photo that is missing or still
                loading never leaves an invisible button. */}
            <GalleryIcon />
            {latestPhoto && <Image source={{ uri: latestPhoto }} style={styles.galleryPhoto} />}
          </Pressable>

          <Pressable
            onPress={handleFlip}
            style={({ pressed }) => [styles.swap, styles.roundOutline, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={facing === 'back' ? 'Switch to front camera' : 'Switch to back camera'}
          >
            <CameraSwapIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },
  pressed: { opacity: 0.7 },

  popupText: { alignSelf: 'stretch', gap: 8 },
  errorText: { color: colors.warning, textAlign: 'center' },

  // Figma: 32px outlined circles, 59pt down on a 390 × 844 frame.
  topBar: {
    position: 'absolute',
    left: spacing.screen,
    right: spacing.screen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  lightGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginLeft: 'auto' },
  lightLabel: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lightLabelText: { fontFamily: fonts.bodySemiBold, fontSize: 12, lineHeight: 20, color: colors.textOnPrimary },

  bottom: { ...absoluteFill, top: undefined, alignItems: 'center' },

  uploadErrorPill: {
    marginBottom: spacing.md,
    marginHorizontal: spacing.screen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  uploadErrorPillText: { ...type.bodySm, color: colors.textOnPrimary, textAlign: 'center' },

  // Lens switcher: a faint pill, 60px above the shutter.
  lensRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 60,
  },
  lens: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lensSelected: { width: 46, height: 46, borderRadius: 23 },
  lensSelectedLabel: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  lensText: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 18, letterSpacing: -0.2, color: colors.textOnPrimary },
  lensSelectedText: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 20, letterSpacing: -0.3, color: colors.lensActive },

  // 78px button; the 82px artwork overhangs it by 2px all round, as in Figma.
  shutter: { width: 78, height: 78, alignItems: 'center', justifyContent: 'center' },
  shutterBusy: { opacity: 0.5 },

  bottomRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    marginTop: 36,
  },
  roundOutline: { borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' },
  gallery: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  galleryPhoto: { ...absoluteFill },
  swap: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
});
