import { StyleSheet } from 'react-native';

export const reservationStyles = StyleSheet.create({
  // MyReservations, ReservationConfirm, ReservationSuccess
  myReservations: {
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      color: '#6b7280',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#1f2937',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: '#6b7280',
      marginBottom: 20,
      textAlign: 'center',
    },
    reservationCard: {
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    reservationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    officeName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    location: {
      fontSize: 14,
      color: '#6b7280',
      marginBottom: 4,
    },
    dateTime: {
      fontSize: 14,
      color: '#374151',
      fontWeight: '500',
      marginBottom: 12,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    detailButton: {
      backgroundColor: '#2563eb',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      flex: 1,
    },
    detailButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: '#ef4444',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      flex: 1,
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    // YENİ EKLENEN TAB STİLLERİ
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 4,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 6,
    },
    tabActive: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#6b7280',
    },
    tabTextActive: {
      color: '#2563eb',
      fontWeight: '600',
    },
  },

  //ReservationConfirm
  reservationConfirm: {
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#2563eb',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 15,
    },
    backText: {
      color: '#fff',
      fontSize: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#6b7280',
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    infoCard: {
      backgroundColor: '#f8fafc',
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    locationName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    locationAddress: {
      fontSize: 14,
      color: '#6b7280',
    },
    officeName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 8,
    },
    officeDescription: {
      fontSize: 14,
      color: '#6b7280',
      lineHeight: 20,
    },
    dateTime: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    timeSlot: {
      fontSize: 14,
      color: '#6b7280',
    },
    confirmButton: {
      backgroundColor: '#2563eb',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
    },
    confirmButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    // YENİ EKLENEN STİLLER
    noticeCard: {
      backgroundColor: '#e3f2fd',
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#2196f3',
      marginBottom: 20,
    },
    noticeTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1976d2',
      marginBottom: 8,
    },
    noticeText: {
      fontSize: 14,
      color: '#1976d2',
      lineHeight: 20,
    },
    confirmButtonDisabled: {
      backgroundColor: '#9ca3af',
    },
    dateRange: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    daysCount: {
      fontSize: 14,
      color: '#666',
      marginBottom: 10,
    },
    dateList: {
      marginTop: 10,
    },
    dateItem: {
      fontSize: 12,
      color: '#888',
      marginBottom: 2,
    },
    hoursCount: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    totalHours: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4CAF50',
      marginTop: 5,
    },
  },

  //ReservationSuccess
  reservationSuccess: {
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#10b981',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    checkmark: {
      color: '#fff',
      fontSize: 36,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    detailsCard: {
      backgroundColor: '#f8fafc',
      padding: 20,
      borderRadius: 12,
      width: '100%',
      marginBottom: 32,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    detailDate: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
    },
    detailTime: {
      fontSize: 16,
      color: '#6b7280',
    },
    divider: {
      height: 1,
      backgroundColor: '#e5e7eb',
      marginVertical: 12,
    },
    doctorName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 4,
    },
    specialty: {
      fontSize: 14,
      color: '#6b7280',
    },
    primaryButton: {
      backgroundColor: '#2563eb',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
      marginBottom: 12,
    },
    primaryButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
      borderWidth: 1,
      borderColor: '#d1d5db',
    },
    secondaryButtonText: {
      color: '#6b7280',
      fontSize: 16,
      fontWeight: '600',
    },
  },
});
