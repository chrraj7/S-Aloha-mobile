import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from './theme';

/** S-Aloha brand mark: the single-stroke hexagonal S and its leading diamond. */
export function BrandMark({ size = 40, onLight = false }: { size?: number; onLight?: boolean }) {
  const from = onLight ? colors.accentBlue : colors.brandBlue;
  const to = onLight ? colors.accentTeal : colors.brandTeal;
  return (
    <View accessible={false} style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Defs>
          <LinearGradient id="brandMarkGradient" x1="0" y1="8" x2="0" y2="40" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Path d="M24 1.8 43.2 12.9v22.2L24 46.2 4.8 35.1V12.9z" stroke={from} strokeOpacity=".4" strokeWidth="1.2" />
        <Path d="M32 13.4 24 8.8l-8 4.6v6.9l8 4.6 8 4.6v6.9l-8 4.6-8-4.6" stroke="url(#brandMarkGradient)" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
        <Path d="m35.2 9.2 2.2 2.2-2.2 2.2-2.2-2.2z" fill={to} />
      </Svg>
    </View>
  );
}

export function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <View style={styles.row}>
      <BrandMark size={38} onLight={!inverse} />
    </View>
  );
}

const styles = StyleSheet.create({ row: { alignItems: 'center', flexDirection: 'row' } });
