import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GradientBackground = ({
  children,
  style,
}: GradientBackgroundProps) => {
  return (
    <LinearGradient
      colors={[
        colors.background.gradient.start,
        colors.background.gradient.middle,
        colors.background.gradient.end,
      ]}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
