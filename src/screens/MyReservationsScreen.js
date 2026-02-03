import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { globalStyles } from '../styles/globalStyles';
import { reservationStyles } from '../styles/reservationStyles';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const MyReservationsScreen = ({ onNavigate, currentScreen, params }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'confirmed', 'completed'

  const fetchReservations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    
    let query = supabase
      .from('gp_reservations')
      .select(`
        *,
        gp_offices (name, description, gp_locations (name))
      `)
      .eq('user_id', user.id);

    // Sadece pending durumu için filtrele
    if (activeTab !== 'all') {
      query = query.eq('status', activeTab);
    }

    // Tarihe göre sırala (en yakın en üstte)
    const { data, error } = await query
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: true });

    if (!error && data) {
      // Şimdiki tarihi al
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Durumları güncelle (tarih geçmişse completed yap)
      const updatedReservations = data.map(reservation => {
        if (reservation.status === 'confirmed' && reservation.reservation_date < today) {
          return { ...reservation, status: 'completed' };
        }
        return reservation;
      });

      setReservations(updatedReservations);
    }
    setLoading(false);
  }, [user, activeTab]); // activeTab dependency eklendi

  // İlk yükleme ve activeTab değiştiğinde
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]); // fetchReservations dependency eklendi

  // Parametrelerden refresh gelirse yenile
  useEffect(() => {
    if (params?.refresh) {
      fetchReservations();
    }
  }, [params?.refresh, fetchReservations]); // fetchReservations dependency eklendi

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edildi';
      case 'completed': return 'Tamamlandı';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981'; // yeşil
      case 'pending': return '#f59e0b'; // turuncu
      case 'cancelled': return '#ef4444'; // kırmızı
      case 'completed': return '#6b7280'; // gri
      default: return '#6b7280';
    }
  };

  const getFilteredReservations = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return reservations.filter(reservation => {
      if (activeTab === 'all') return true;
      if (activeTab === 'completed') {
        return reservation.status === 'completed' || 
               (reservation.status === 'confirmed' && reservation.reservation_date < today);
      }
      return reservation.status === activeTab;
    });
  };

  const filteredReservations = getFilteredReservations();

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Rezervasyonlarım" onBack={() => onNavigate('home')} showBack={true} />
        <View style={reservationStyles.myReservations.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={reservationStyles.myReservations.loadingText}>Rezervasyonlar yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Rezervasyonlarım" 
        onBack={() => onNavigate('home')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        {/* Tab Menü */}
        <View style={reservationStyles.myReservations.tabContainer}>
          <TouchableOpacity 
            style={[
              reservationStyles.myReservations.tab,
              activeTab === 'all' && reservationStyles.myReservations.tabActive
            ]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[
              reservationStyles.myReservations.tabText,
              activeTab === 'all' && reservationStyles.myReservations.tabTextActive
            ]}>
              Tümü
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              reservationStyles.myReservations.tab,
              activeTab === 'pending' && reservationStyles.myReservations.tabActive
            ]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[
              reservationStyles.myReservations.tabText,
              activeTab === 'pending' && reservationStyles.myReservations.tabTextActive
            ]}>
              Bekleyen
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              reservationStyles.myReservations.tab,
              activeTab === 'confirmed' && reservationStyles.myReservations.tabActive
            ]}
            onPress={() => setActiveTab('confirmed')}
          >
            <Text style={[
              reservationStyles.myReservations.tabText,
              activeTab === 'confirmed' && reservationStyles.myReservations.tabTextActive
            ]}>
              Onaylanan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              reservationStyles.myReservations.tab,
              activeTab === 'completed' && reservationStyles.myReservations.tabActive
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[
              reservationStyles.myReservations.tabText,
              activeTab === 'completed' && reservationStyles.myReservations.tabTextActive
            ]}>
              Tamamlanan
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={reservationStyles.myReservations.sectionTitle}>
          {activeTab === 'all' ? 'Tüm Rezervasyonlar' :
           activeTab === 'pending' ? 'Bekleyen Rezervasyonlar' :
           activeTab === 'confirmed' ? 'Onaylanan Rezervasyonlar' : 'Tamamlanan Rezervasyonlar'}
        </Text>
        
        {filteredReservations.length === 0 ? (
          <View style={reservationStyles.myReservations.emptyState}>
            <Text style={reservationStyles.myReservations.emptyStateText}>
              {activeTab === 'all' ? 'Henüz rezervasyonunuz bulunmuyor.' :
               activeTab === 'pending' ? 'Bekleyen rezervasyonunuz bulunmuyor.' :
               activeTab === 'confirmed' ? 'Onaylanan rezervasyonunuz bulunmuyor.' : 'Tamamlanan rezervasyonunuz bulunmuyor.'}
            </Text>
            {activeTab === 'all' && (
              <TouchableOpacity 
                style={globalStyles.button.primary}
                onPress={() => onNavigate('location-select')}
              >
                <Text style={globalStyles.text.button}>Rezervasyon Yap</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredReservations.map((reservation) => (
            <View key={reservation.id} style={reservationStyles.myReservations.reservationCard}>
              <View style={reservationStyles.myReservations.reservationHeader}>
                <Text style={reservationStyles.myReservations.officeName}>
                  {reservation.gp_offices?.name}
                </Text>
                <View style={[
                  reservationStyles.myReservations.statusBadge, 
                  { backgroundColor: getStatusColor(reservation.status) }
                ]}>
                  <Text style={reservationStyles.myReservations.statusText}>
                    {getStatusText(reservation.status)}
                  </Text>
                </View>
              </View>
              
              <Text style={reservationStyles.myReservations.location}>
                {reservation.gp_offices?.gp_locations?.name}
              </Text>
              
              <Text style={reservationStyles.myReservations.dateTime}>
                {formatDate(reservation.reservation_date)} • {reservation.start_time} - {reservation.end_time}
              </Text>
              
              <View style={reservationStyles.myReservations.actions}>
                <TouchableOpacity style={reservationStyles.myReservations.detailButton}>
                  <Text style={reservationStyles.myReservations.detailButtonText}>Detayları Görüntüle</Text>
                </TouchableOpacity>
                
                {reservation.status === 'pending' && (
                  <TouchableOpacity style={reservationStyles.myReservations.cancelButton}>
                    <Text style={reservationStyles.myReservations.cancelButtonText}>İptal Et</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default MyReservationsScreen;
