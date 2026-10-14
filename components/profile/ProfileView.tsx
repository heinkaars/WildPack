import { ReactNode, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BackButton,
  BoltIcon,
  Button,
  CaptureStatIcon,
  ChevronRight,
  Docent,
  DOCENT_ANIMALS,
  docentFromLook,
  Gradient,
  CheckCircleIcon,
  LogoutIcon,
  Popup,
  PopupButtons,
  ScreenStatusBar,
  SparkIcon,
  SpeciesStatIcon,
  StarIcon,
  Switch,
  TrashIcon,
} from '../ui';
import type { DocentAnimal } from '../ui';
import { OnboardingBackground } from '../onboarding/OnboardingScreen';
import { Profile } from '../../lib/types';
import { Stats } from '../../lib/xp';
import { colors, radii, spacing, type } from '../../lib/theme';

type Props = {
  profile: Profile;
  /** False while the name is still a stand-in; nothing may be saved over it yet. */
  profileLoaded: boolean;
  stats: Stats;
  speciesCount: number;
  /** The signed-in address, or null for an account that only lives on this phone. */
  email: string | null;
  locationOn: boolean;
  onBack: () => void;
  onRename: (name: string) => void;
  onPickDocent: (animal: DocentAnimal) => void;
  onToggleLocation: (on: boolean) => void;
  onCreateAccount: () => void;
  onSignIn: () => void;
  onLogOut: () => Promise<void>;
  /** Rejects with a message written for the user. */
  onDeleteAccount: () => Promise<void>;
  /** Development-only extras at the foot of the page. */
  devTools?: ReactNode;
};

/**
 * Figma Home-Profile 88384:3300: the docent and name, four stats, the docent
 * picker, the location switch and the account actions. Takes its data as
 * props so `/dev/home?screen=profile` can show it without an account.
 */
export function ProfileView(props: Props) {
  const { profile, profileLoaded, stats, speciesCount, email, locationOn } = props;
  const insets = useSafeAreaInsets();
  const docent = docentFromLook(profile.look);

  const [name, setName] = useState(profile.name);
  // The shown name is a stand-in until the account's real one arrives. Keep
  // the field in step with it, and out of reach until then.
  useEffect(() => setName(profile.name), [profile.name]);

  const [confirming, setConfirming] = useState<'logout' | 'delete' | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function commitName() {
    const trimmed = name.trim();
    if (!profileLoaded || !trimmed || trimmed === profile.name) {
      setName(profile.name);
      return;
    }
    props.onRename(trimmed);
  }

  async function confirmLogOut() {
    setBusy(true);
    try {
      await props.onLogOut();
    } finally {
      setBusy(false);
      setConfirming(null);
    }
  }

  async function confirmDelete() {
    setBusy(true);
    setDeleteError(null);
    try {
      await props.onDeleteAccount();
      setConfirming(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const metrics = [
    { icon: <StarIcon />, label: `${stats.streak}-day streak` },
    { icon: <SpeciesStatIcon />, label: `Total ${speciesCount} Species` },
    { icon: <CaptureStatIcon />, label: `${stats.captures} ${stats.captures === 1 ? 'Capture' : 'Captures'}` },
    { icon: <BoltIcon />, label: `${stats.xp} XP` },
  ];

  return (
    <View style={styles.screen}>
      <OnboardingBackground />
      <ScreenStatusBar />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={props.onBack} style={styles.back} />

        <View style={styles.identity}>
          <Docent animal={docent} width={97} />
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={commitName}
            onSubmitEditing={commitName}
            returnKeyType="done"
            editable={profileLoaded}
            maxLength={24}
            style={[type.headingM, styles.name, !profileLoaded && styles.nameWaiting]}
            accessibilityLabel="Your name"
            accessibilityHint="Tap to change your name"
          />
          {email && <Text style={[type.bodySm, styles.muted, styles.email]}>{email}</Text>}
        </View>

        <View style={styles.metrics}>
          {metrics.map((metric) => (
            <View key={metric.label} style={styles.metric} accessible accessibilityLabel={metric.label}>
              {metric.icon}
              <Text style={[type.captionSm, styles.center]} numberOfLines={2}>
                {metric.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.cards}>
          <View style={[styles.card, styles.docentCard]}>
            <Text style={type.levelSemiBold}>Choose your Docent</Text>
            <View style={styles.docents}>
              {DOCENT_ANIMALS.map((animal) => {
                const selected = animal === docent;
                return (
                  <Pressable
                    key={animal}
                    onPress={() => profileLoaded && !selected && props.onPickDocent(animal)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled: !profileLoaded }}
                    accessibilityLabel={animal}
                    style={({ pressed }) => pressed && styles.pressed}
                  >
                    <Docent animal={animal} width={76} />
                    {selected && (
                      <Gradient style={styles.check}>
                        <CheckCircleIcon size={10} />
                      </Gradient>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.card, styles.locationCard]}>
            <View style={styles.flex}>
              <Text style={type.levelSemiBold}>Location</Text>
              <Text style={[type.labelSm, styles.muted]}>Save where each sighting was taken</Text>
            </View>
            <Switch checked={locationOn} onChange={props.onToggleLocation} accessibilityLabel="Location" />
          </View>

          {!email && (
            <Text style={[type.labelSm, styles.muted, styles.note]}>
              Your life list only lives on this phone. Create an account to keep it safe and take it to a
              new phone.
            </Text>
          )}

          <View style={styles.actionsShadow}>
            <View style={styles.actions}>
              {email ? (
                <ActionRow icon={<LogoutIcon />} label="Log out" onPress={() => setConfirming('logout')} divider />
              ) : (
                <>
                  <ActionRow icon={<SparkIcon />} label="Create an account" onPress={props.onCreateAccount} divider />
                  <ActionRow icon={<LogoutIcon />} label="I have an account" onPress={props.onSignIn} divider />
                </>
              )}
              <ActionRow
                icon={<TrashIcon />}
                label="Delete account"
                destructive
                onPress={() => {
                  setDeleteError(null);
                  setConfirming('delete');
                }}
              />
            </View>
          </View>

          {props.devTools}
        </View>
      </ScrollView>

      <Popup visible={confirming === 'logout'} onClose={busy ? undefined : () => setConfirming(null)}>
        <Text style={[type.headingM, styles.center]}>Log out?</Text>
        <Text style={[type.bodyLg, styles.center, styles.secondary]}>
          Your life list stays safe on your account. This phone starts fresh until you sign in again.
        </Text>
        <PopupButtons>
          <Button label="Cancel" variant="outline" size="compact" onPress={() => setConfirming(null)} disabled={busy} style={styles.flex} />
          <Button label="Log out" size="compact" onPress={confirmLogOut} loading={busy} style={styles.flex} />
        </PopupButtons>
      </Popup>

      <Popup visible={confirming === 'delete'} onClose={busy ? undefined : () => setConfirming(null)}>
        <Docent animal={docent} mood="sad" width={74} />
        <Text style={[type.headingM, styles.center]}>Delete your account?</Text>
        <Text style={[type.bodyLg, styles.center, styles.secondary]}>
          Your life list, photos and chats are deleted for good. This can’t be undone.
        </Text>
        {deleteError && <Text style={[type.bodySm, styles.center, styles.error]}>{deleteError}</Text>}
        <PopupButtons>
          <Button label="Cancel" variant="outline" size="compact" onPress={() => setConfirming(null)} disabled={busy} style={styles.flex} />
          <Button label="Delete" size="compact" onPress={confirmDelete} loading={busy} style={styles.flex} />
        </PopupButtons>
      </Popup>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
  destructive = false,
  divider = false,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  divider?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.action, divider && styles.actionDivider, pressed && styles.actionPressed]}
    >
      <View style={[styles.actionIcon, { backgroundColor: destructive ? colors.destructiveFill : colors.primaryFill }]}>
        {icon}
      </View>
      <Text style={[type.levelSemiBold, styles.flex, destructive && { color: colors.destructive }]}>{label}</Text>
      <ChevronRight size={16} color={destructive ? colors.destructiveMuted : colors.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: spacing.screen,
    gap: 20,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: -20,
  },
  identity: {
    alignItems: 'center',
    gap: 8,
  },
  // A fixed height: iOS sizes a text field by the font's full ascent, which
  // for Baloo leaves a tall empty band under the name.
  name: {
    height: 30,
    textAlign: 'center',
    minWidth: 160,
    paddingVertical: 0,
  },
  // Baloo's glyphs sit high in their box; this pulls the address up to meet them.
  email: {
    marginTop: -6,
  },
  nameWaiting: {
    color: colors.textMuted,
  },
  metrics: {
    flexDirection: 'row',
    gap: 4,
  },
  metric: {
    flex: 1,
    height: 84,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  divider: {
    height: 1,
    borderRadius: 1,
    backgroundColor: colors.fillStrong,
  },
  cards: {
    gap: 4,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: colors.surface,
  },
  docentCard: {
    gap: 12,
  },
  docents: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5.7,
  },
  check: {
    position: 'absolute',
    top: 12,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  note: {
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  actions: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.warningFill,
  },
  // Kept apart from `actions`: iOS clips a shadow drawn by the view that clips its corners.
  actionsShadow: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionDivider: {
    borderBottomWidth: 1.2,
    borderBottomColor: colors.fill,
  },
  actionPressed: {
    backgroundColor: colors.fill,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
  muted: {
    color: colors.textMuted,
  },
  secondary: {
    color: colors.textSecondary,
  },
  error: {
    color: colors.warning,
  },
  pressed: {
    opacity: 0.7,
  },
});
