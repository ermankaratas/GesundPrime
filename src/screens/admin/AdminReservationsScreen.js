import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { supabase } from '../../services/supabase';
import { globalStyles } from '../../styles/globalStyles';
import { adminStyles } from '../../styles/adminStyles';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNavigation';

const AdminReservationsScreen = ({ onNavigate, currentScreen }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('gp_reservations')
        .select(`
          *,
          gp_users (name, email, phone),
          gp_offices (name, gp_locations (name))
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (!error && data) {
        setReservations(data);
      }
    } catch (error) {
      console.error('Fetch reservations error:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('gp_reservations')
        .update({ status: newStatus })
        .eq('id', reservationId);

      if (!error) {
        // Ofis durumunu güncelle
        if (newStatus === 'confirmed') {
          const reservation = reservations.find(r => r.id === reservationId);
          if (reservation) {
            await supabase
              .from('gp_offices')
              .update({ status: 'occupied' })
              .eq('id', reservation.office_id);
          }
        } else if (newStatus === 'cancelled') {
          const reservation = reservations.find(r => r.id === reservationId);
          if (reservation) {
            await supabase
              .from('gp_offices')
              .update({ status: 'available' })
              .eq('id', reservation.office_id);
          }
        }
        
        fetchReservations(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  // Filtrelenmiş rezervasyonlar
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = searchQuery === '' || 
      reservation.users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.offices?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.users?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Rezervasyon Yönetimi" onBack={() => onNavigate('admin')} showBack={true} />
        <View style={adminStyles.reservations.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={adminStyles.reservations.loadingText}>Rezervasyonlar yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Rezervasyon Yönetimi" 
        onBack={() => onNavigate('admin')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        {/* Arama ve Filtre */}
        <View style={adminStyles.reservations.searchFilterContainer}>
          <TextInput
            style={adminStyles.reservations.searchInput}
            placeholder="Kullanıcı, ofis veya email ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <View style={adminStyles.reservations.filterContainer}>
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'pending', label: 'Bekleyen' },
              { key: 'confirmed', label: 'Onaylı' },
              { key: 'cancelled', label: 'İptal' }
            ].map((filterItem) => (
              <TouchableOpacity
                key={filterItem.key}
                style={[
                  adminStyles.reservations.filterButton,
                  filter === filterItem.key && adminStyles.reservations.filterButtonActive
                ]}
                onPress={() => setFilter(filterItem.key)}
              >
                <Text style={[
                  adminStyles.reservations.filterText,
                  filter === filterItem.key && adminStyles.reservations.filterTextActive
                ]}>
                  {filterItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* İstatistik */}
        <View style={adminStyles.reservations.statsBar}>
          <View style={adminStyles.reservations.statItem}>
            <Text style={adminStyles.reservations.statNumber}>{filteredReservations.length}</Text>
            <Text style={adminStyles.reservations.statLabel}>Toplam</Text>
          </View>
          <View style={adminStyles.reservations.statItem}>
            <Text style={[adminStyles.reservations.statNumber, { color: '#f59e0b' }]}>
              {filteredReservations.filter(r => r.status === 'pending').length}
            </Text>
            <Text style={adminStyles.reservations.statLabel}>Bekleyen</Text>
          </View>
          <View style={adminStyles.reservations.statItem}>
            <Text style={[adminStyles.reservations.statNumber, { color: '#10b981' }]}>
              {filteredReservations.filter(r => r.status === 'confirmed').length}
            </Text>
            <Text style={adminStyles.reservations.statLabel}>Onaylı</Text>
          </View>
        </View>

        {/* Rezervasyon Listesi */}
        {filteredReservations.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery ? 'Aranan kriterlere uygun rezervasyon bulunamadı.' : 'Rezervasyon bulunmuyor.'}
            </Text>
          </View>
        ) : (
          filteredReservations.map((reservation) => (
            <View key={reservation.id} style={adminStyles.reservations.reservationCard}>
              <View style={adminStyles.reservations.reservationHeader}>
                <View style={adminStyles.reservations.reservationInfo}>
                  <Text style={adminStyles.reservations.officeName}>{reservation.offices?.name}</Text>
                  <Text style={adminStyles.reservations.userInfo}>
                    {reservation.users?.name} • {reservation.users?.specialty}
                  </Text>
                  <Text style={adminStyles.reservations.userContact}>{reservation.users?.email}</Text>
                  {reservation.users?.phone && (
                    <Text style={adminStyles.reservations.userContact}>📞 {reservation.users.phone}</Text>
                  )}
                </View>
                <View style={[adminStyles.reservations.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
                  <Text style={adminStyles.reservations.statusText}>{getStatusText(reservation.status)}</Text>
                </View>
              </View>
              
              <View style={adminStyles.reservations.reservationDetails}>
                <Text style={adminStyles.reservations.location}>📍 {reservation.offices?.locations?.name}</Text>
                <Text style={adminStyles.reservations.dateTime}>
                  🗓️ {formatDate(reservation.start_time)} • 🕐 {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                </Text>
                
                {reservation.notes && (
                  <Text style={adminStyles.reservations.notes}>📝 {reservation.notes}</Text>
                )}
                
                <Text style={adminStyles.reservations.createdAt}>
                  Oluşturulma: {new Date(reservation.created_at).toLocaleDateString('tr-TR')}
                </Text>
              </View>

              {/* Action Butonları */}
              <View style={adminStyles.reservations.actions}>
                {reservation.status === 'pending' && (
                  <>
                    <TouchableOpacity 
                      style={adminStyles.reservations.approveButton}
                      onPress={() => handleStatusUpdate(reservation.id, 'confirmed')}
                    >
                      <Text style={adminStyles.reservations.approveButtonText}>✓ Onayla</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={adminStyles.reservations.rejectButton}
                      onPress={() => handleStatusUpdate(reservation.id, 'cancelled')}
                    >
                      <Text style={adminStyles.reservations.rejectButtonText}>✗ Reddet</Text>
                    </TouchableOpacity>
                  </>
                )}

                {reservation.status === 'confirmed' && (
                  <TouchableOpacity 
                    style={adminStyles.reservations.cancelButton}
                    onPress={() => handleStatusUpdate(reservation.id, 'cancelled')}
                  >
                    <Text style={adminStyles.reservations.cancelButtonText}>İptal Et</Text>
                  </TouchableOpacity>
                )}

                {reservation.status === 'cancelled' && (
                  <TouchableOpacity 
                    style={adminStyles.reservations.reopenButton}
                    onPress={() => handleStatusUpdate(reservation.id, 'pending')}
                  >
                    <Text style={adminStyles.reservations.reopenButtonText}>Tekrar Aç</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={adminStyles.reservations.detailsButton}
                  onPress={() => {/* Detay sayfasına git */}}
                >
                  <Text style={adminStyles.reservations.detailsButtonText}>Detay</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default AdminReservationsScreen;
