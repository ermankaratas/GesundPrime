import { StyleSheet } from 'react-native';

export const listStyles = StyleSheet.create({
  // OfficeList
  officeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  officeInfo: {
    flex: 1,
  },
  officeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  officeStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusAvailable: {
    color: '#059669',
  },
  statusOccupied: {
    color: '#dc2626',
  },
  selectButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
