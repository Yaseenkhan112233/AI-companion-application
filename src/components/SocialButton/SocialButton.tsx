import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export const SocialButton = ({ title, onPress, icon }: SocialButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.input.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.input.border,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.text.primary,
  },
});
