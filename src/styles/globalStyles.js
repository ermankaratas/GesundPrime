
import { StyleSheet } from 'react-native';

// Renk Paleti
const colors = {
  primary: '#2563eb',
  primaryLight: '#dbeafe',
  secondary: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  light: '#f8fafc',
  dark: '#1f2937',
  white: '#ffffff',
  gray: {
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

export const globalStyles = StyleSheet.create({
  colors: colors,

  // Tipografi
  text: {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.dark,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.gray[700],
    },
    body: {
      fontSize: 16,
      color: colors.gray[600],
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      color: colors.gray[500],
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
    },
    // YENİ EKLENEN STİL
    buttonSecondary: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary, // İkincil buton metni için ana tema rengini kullan
    }
  },

  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  // Butonlar
  button: {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    secondary: {
      backgroundColor: 'transparent',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    danger: {
      backgroundColor: colors.danger,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    }
  },

  // Inputlar
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.gray[100],
  },
  
  // ... (diğer stiller aynı kalacak)
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
