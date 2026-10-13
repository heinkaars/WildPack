import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { colors, palette, spacing, type } from '../../lib/theme';
import {
  BADGES,
  BadgeId,
  BadgeTile,
  BottomNav,
  Button,
  ChatInput,
  Checkbox,
  DOCENT_ANIMALS,
  Docent,
  DocentAnimal,
  DocentCard,
  Gradient,
  Input,
  NavTab,
  Radio,
  ScreenStatusBar,
  Switch,
} from '../../components/ui';

/** Dev-only gallery of the Figma foundations. Open /dev/components in a dev build. */
export default function ComponentGallery() {
  const [tab, setTab] = useState<NavTab>('home');
  const [docent, setDocent] = useState<DocentAnimal>('lion');
  const [name, setName] = useState('');
  const [chat, setChat] = useState('');
  const [stay, setStay] = useState(true);
  const [plan, setPlan] = useState<'a' | 'b'>('a');
  const [location, setLocation] = useState(false);

  if (!__DEV__) return <Redirect href="/" />;

  const badgeIds = Object.keys(BADGES).map(Number) as BadgeId[];

  return (
    <View style={styles.screen}>
      <ScreenStatusBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.headingXL}>Foundations</Text>
        <Text style={[type.bodyLg, { color: colors.textMuted }]}>
          Fredoka One for titles, Baloo for section headings, Nunito for body. Everything below is built from lib/theme.ts.
        </Text>

        <Section title="Colour">
          <View style={styles.row}>
            <Swatch label="Primary" color={palette.orange} />
            <Swatch label="Warning" color={palette.warning} />
            <Swatch label="Text" color={palette.dark} />
            <Swatch label="Cream" color={palette.cream} />
            <Swatch label="Track" color={palette.progressTrack} />
          </View>
          <Gradient style={styles.gradientBar} />
          <Text style={[type.labelSm, { color: colors.textMuted }]}>Primary gradient, 180° #FF9900 → #F94F40</Text>
        </Section>

        <Section title="Type">
          <Text style={type.headingXL}>Heading/XL</Text>
          <Text style={type.headingL}>Heading/L</Text>
          <Text style={type.headingM}>Heading/M</Text>
          <Text style={type.button}>Level/Button-text</Text>
          <Text style={type.levelSemiBold}>Level/SemiBold</Text>
          <Text style={type.levelMedium}>Level/Medium</Text>
          <Text style={type.bodyBold}>body/md-bold · 1,250 XP</Text>
          <Text style={type.bodyLg}>Body text/Lg</Text>
          <Text style={type.bodySm}>Body text/Sm</Text>
          <Text style={type.label}>body/lg-bold · labels</Text>
          <Text style={type.count}>body/black · 12</Text>
          <Text style={type.labelSm}>body/sm-semibold · Mon Tue Wed</Text>
          <Text style={type.captionLg}>Caption/Lg</Text>
          <Text style={type.captionSm}>Caption/sm</Text>
        </Section>

        <Section title="Buttons">
          <Button label="Learn more" onPress={() => {}} chevronLeft chevronRight />
          <View style={styles.onCream}>
            <Button label="Learn more" variant="secondary" onPress={() => {}} chevronLeft chevronRight />
          </View>
          <Button label="Learn more" variant="outline" onPress={() => {}} chevronLeft chevronRight />
          <Button label="Learn more" disabled onPress={() => {}} chevronLeft chevronRight />
          <Button label="Continue" onPress={() => {}} />
          <Button label="Continue" loading onPress={() => {}} />
        </Section>

        <Section title="Controls">
          <View style={styles.controlRow}>
            <Checkbox checked={stay} onChange={setStay} accessibilityLabel="Stay signed in" />
            <Text style={type.bodySm}>Stay signed in</Text>
          </View>
          <View style={styles.controlRow}>
            <Radio checked={plan === 'a'} onChange={() => setPlan('a')} accessibilityLabel="Option A" />
            <Text style={type.bodySm}>Option A</Text>
            <Radio checked={plan === 'b'} onChange={() => setPlan('b')} accessibilityLabel="Option B" />
            <Text style={type.bodySm}>Option B</Text>
          </View>
          <View style={styles.controlRow}>
            <Switch checked={location} onChange={setLocation} accessibilityLabel="Location" />
            <Text style={type.bodySm}>Location {location ? 'on' : 'off'}</Text>
          </View>
        </Section>

        <Section title="Inputs">
          <Input placeholder="Input" value={name} onChangeText={setName} dropdown />
          <Input placeholder="Input" disabled dropdown />
          <Input placeholder="Tap to see the focused outline" />
          <Input value="Input" error dropdown />
          <ChatInput
            placeholder="Input"
            value={chat}
            onChangeText={setChat}
            onSend={() => setChat('')}
          />
        </Section>

        <Section title="Bottom navigation">
          <View style={styles.onCream}>
            <BottomNav active={tab} onHome={() => setTab('home')} onCapture={() => setTab('capture')} />
          </View>
        </Section>

        <Section title="Badges">
          <Text style={[type.labelSm, { color: colors.textMuted }]}>Earned</Text>
          <View style={styles.wrap}>
            {badgeIds.map((id) => (
              <BadgeTile key={`on-${id}`} badge={id} earned />
            ))}
          </View>
          <Text style={[type.labelSm, { color: colors.textMuted }]}>Locked</Text>
          <View style={styles.wrap}>
            {badgeIds.map((id) => (
              <BadgeTile key={`off-${id}`} badge={id} earned={false} />
            ))}
          </View>
        </Section>

        <Section title="Docents">
          <View style={styles.wrap}>
            {DOCENT_ANIMALS.map((a) => (
              <Docent key={`h-${a}`} animal={a} width={76} />
            ))}
          </View>
          <View style={styles.wrap}>
            {DOCENT_ANIMALS.map((a) => (
              <Docent key={`s-${a}`} animal={a} mood="sad" width={76} />
            ))}
          </View>
          <Text style={[type.labelSm, { color: colors.textMuted }]}>Picker — tap to select</Text>
          <View style={styles.wrap}>
            {DOCENT_ANIMALS.map((a) => (
              <DocentCard key={`c-${a}`} animal={a} width={160} selected={docent === a} onPress={() => setDocent(a)} />
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={type.headingM}>{title}</Text>
      {children}
    </View>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.swatch}>
      <View style={[styles.chip, { backgroundColor: color }]} />
      <Text style={type.labelSm}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screen, paddingBottom: 80, gap: spacing.lg, maxWidth: 430, width: '100%', alignSelf: 'center' },
  section: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  swatch: { alignItems: 'center', gap: spacing.xs },
  chip: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.fillStrong },
  gradientBar: { height: 56, borderRadius: 16 },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  onCream: { backgroundColor: colors.cream, padding: spacing.md, borderRadius: 16 },
});
