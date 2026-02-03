import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Colors
  colors: {
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
  },

  // Typography
  text: {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1f2937',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#374151',
    },
    body: {
      fontSize: 16,
      color: '#6b7280',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      color: '#9ca3af',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    }
  },

  // Layout
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  // Buttons
  button: {
    primary: {
      backgroundColor: '#2563eb',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#d1d5db',
    },
    danger: {
      backgroundColor: '#ef4444',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    }
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
    color: '#6b7280',
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },

  // Menu Cards
  menuCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  adminCard: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b91c1c',
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  adminDescription: {
    fontSize: 14,
    color: '#fecaca',
    textAlign: 'center',
  },

  // Common Components
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
