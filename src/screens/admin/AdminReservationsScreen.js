
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/Header';
import Card from '../../components/Card'; // Card bileşenini import et
import API_URL from '../../config/api';
import { formatDate } from '../../utils/helpers';

const AdminReservationsScreen = ({ onNavigate }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCombinedData = useCallback(async () => {
    setLoading(true);
    try {
      const [resRes, usersRes, officesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/reservations`),
        fetch(`${API_URL}/api/admin/users`),
        fetch(`${API_URL}/api/offices`)
      ]);

      if (!resRes.ok || !usersRes.ok || !officesRes.ok) throw new Error('Veriler alınamadı.');

      const reservationsData = await resRes.json();
      const usersData = await usersRes.json();
      const officesData = await officesRes.json();

      const combinedData = reservationsData.map(reservation => ({
        ...reservation,
        userName: usersData.find(u => u.id === reservation.userId)?.name || 'Bilinmeyen Kullanıcı',
        officeName: officesData.find(o => o.id === reservation.officeId)?.name || 'Bilinmeyen Ofis',
      }));

      setReservations(combinedData);
    } catch (error) {
      console.error('Rezervasyon verilerini getirme hatası:', error);
      Alert.alert('Hata', 'Rezervasyonları alırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCombinedData();
  }, [fetchCombinedData]);

  const handleDeleteReservation = (reservationId) => {
    Alert.alert(
      'Rezervasyonu İptal Et',
      'Bu rezervasyonu kalıcı olarak iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/admin/reservations/${reservationId}`, { method: 'DELETE' });
              if (!response.ok) {
                  const data = await response.json();
                  throw new Error(data.message || 'Rezervasyon iptal edilemedi.');
              }
              Alert.alert('Başarılı', 'Rezervasyon başarıyla iptal edildi.');
              fetchCombinedData();
            } catch (error) {
              console.error('Rezervasyon silme hatası:', error);
              Alert.alert('Hata', error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Rezervasyon Yönetimi" onBack={() => onNavigate('admin')} showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={globalStyles.colors.primary} />
          <Text style={globalStyles.text.body}>Rezervasyonlar Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header title="Rezervasyon Yönetimi" onBack={() => onNavigate('admin')} showBack={true} />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={globalStyles.text.subtitle}>Toplam {reservations.length} Rezervasyon</Text>
        </View>
        {reservations.length === 0 ? (
          <View style={[globalStyles.content, styles.loadingContainer]}>
            <Text style={globalStyles.text.body}>Gösterilecek rezervasyon bulunmuyor.</Text>
          </View>
        ) : (
          reservations.map((item) => (
            <Card key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={globalStyles.text.subtitle}>{item.officeName}</Text>
                <Text style={globalStyles.text.caption}>Kullanıcı: {item.userName}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={globalStyles.text.body}>Tarih: {formatDate(item.date)}</Text>
              </View>
              <View style={styles.cardFooter}>
                <TouchableOpacity 
                    style={[globalStyles.button.danger, styles.deleteButton]}
                    onPress={() => handleDeleteReservation(item.id)}
                >
                  <Text style={[globalStyles.text.button, styles.deleteButtonText]}>İptal Et</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  header: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: globalStyles.colors.gray[200], marginBottom: 8 },
  card: { 
    marginVertical: 8, 
  },
  cardHeader: { marginBottom: 12 },
  cardBody: { marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  deleteButton: { 
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    fontSize: 14,
  },
});

export default AdminReservationsScreen;
