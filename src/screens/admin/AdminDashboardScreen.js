import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabase';
import { globalStyles } from '../../styles/globalStyles';
import { adminStyles } from '../../styles/adminStyles';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNavigation';

const AdminDashboardScreen = ({ onNavigate, currentScreen }) => {
  const [stats, setStats] = useState({});
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      // Toplam rezervasyon sayısı
      const { count: totalReservations } = await supabase
        .from('gp_reservations')
        .select('*', { count: 'exact', head: true });

      // Bekleyen rezervasyon sayısı
      const { count: pendingCount } = await supabase
        .from('gp_reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Onaylanan rezervasyon sayısı
      const { count: confirmedCount } = await supabase
        .from('gp_reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      // Toplam ofis sayısı
      const { count: totalOffices } = await supabase
        .from('gp_offices')
        .select('*', { count: 'exact', head: true });

      // Aktif ofis sayısı
      const { count: activeOffices } = await supabase
        .from('gp_offices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      // Toplam kullanıcı sayısı
      const { count: totalUsers } = await supabase
        .from('gp_users')
        .select('*', { count: 'exact', head: true });

      // Bekleyen rezervasyonları getir
      const { data: pendingData } = await supabase
        .from('gp_reservations')
        .select(`
          *,
          gp_users (name, email),
          gp_offices (name, gp_locations (name))
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalReservations: totalReservations || 0,
        pendingReservations: pendingCount || 0,
        confirmedReservations: confirmedCount || 0,
        totalOffices: totalOffices || 0,
        activeOffices: activeOffices || 0,
        totalUsers: totalUsers || 0
      });

      setPendingReservations(pendingData || []);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleApprove = async (reservationId) => {
    try {
      const { error } = await supabase
        .from('gp_reservations')
        .update({ status: 'confirmed' })
        .eq('id', reservationId);

      if (!error) {
        fetchDashboardData(); // Verileri yenile
      }
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (reservationId) => {
    try {
      const { error } = await supabase
        .from('gp_reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (!error) {
        fetchDashboardData(); // Verileri yenile
      }
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Admin Paneli" onBack={() => onNavigate('home')} showBack={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>Yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Kontrol Paneli" 
        onBack={() => onNavigate('home')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        {/* Genel Bakış */}
        <Text style={globalStyles.sectionTitle}>Genel Bakış</Text>
        
        <View style={adminStyles.dashboard.statsGrid}>
          <View style={[adminStyles.dashboard.statCard, { backgroundColor: '#e0f2fe' }]}>
            <Text style={[adminStyles.dashboard.statNumber, { color: '#0369a1' }]}>{stats.totalReservations}</Text>
            <Text style={[adminStyles.dashboard.statLabel, { color: '#0369a1' }]}>Toplam Rezervasyon</Text>
          </View>
          
          <View style={[adminStyles.dashboard.statCard, { backgroundColor: '#fef3c7' }]}>
            <Text style={[adminStyles.dashboard.statNumber, { color: '#d97706' }]}>{stats.pendingReservations}</Text>
            <Text style={[adminStyles.dashboard.statLabel, { color: '#d97706' }]}>Bekleyen</Text>
          </View>
          
          <View style={[adminStyles.dashboard.statCard, { backgroundColor: '#d1fae5' }]}>
            <Text style={[adminStyles.dashboard.statNumber, { color: '#059669' }]}>{stats.confirmedReservations}</Text>
            <Text style={[adminStyles.dashboard.statLabel, { color: '#059669' }]}>Onaylı</Text>
          </View>
          
          <View style={[adminStyles.dashboard.statCard, { backgroundColor: '#f3f4f6' }]}>
            <Text style={[adminStyles.dashboard.statNumber, { color: '#374151' }]}>{stats.totalOffices}</Text>
            <Text style={[adminStyles.dashboard.statLabel, { color: '#374151' }]}>Toplam Ofis</Text>
          </View>
          
          <View style={[adminStyles.dashboard.statCard, { backgroundColor: '#e0e7ff' }]}>
            <Text style={[adminStyles.dashboard.statNumber, { color: '#4f46e5' }]}>{stats.activeOffices}</Text>
            <Text style={[adminStyles.dashboard.statLabel, { color: '#4f46e5' }]}>Aktif Ofis</Text>
          </View>
          
          <View style={[adminStyles.dashboard.statCard, { backgroundColor: '#fce7f3' }]}>
            <Text style={[adminStyles.dashboard.statNumber, { color: '#db2777' }]}>{stats.totalUsers}</Text>
            <Text style={[adminStyles.dashboard.statLabel, { color: '#db2777' }]}>Kullanıcı</Text>
          </View>
        </View>

        {/* Hızlı İşlemler */}
        <Text style={adminStyles.dashboard.sectionTitle}>Hızlı İşlemler</Text>
        
        <View style={adminStyles.dashboard.quickActions}>
          <TouchableOpacity 
            style={adminStyles.dashboard.quickActionButton}
            onPress={() => onNavigate('admin-reservations')}
          >
            <Text style={adminStyles.dashboard.quickActionIcon}>📋</Text>
            <Text style={adminStyles.dashboard.quickActionText}>Rezervasyon Yönetimi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={adminStyles.dashboard.quickActionButton}
            onPress={() => onNavigate('admin-users')}
          >
            <Text style={adminStyles.dashboard.quickActionIcon}>👥</Text>
            <Text style={adminStyles.dashboard.quickActionText}>Kullanıcı Yönetimi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={adminStyles.dashboard.quickActionButton}
            onPress={() => onNavigate('admin-offices')}
          >
            <Text style={adminStyles.dashboard.quickActionIcon}>🏢</Text>
            <Text style={adminStyles.dashboard.quickActionText}>Ofis Yönetimi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={adminStyles.dashboard.quickActionButton}
            onPress={() => onNavigate('admin-reports')}
          >
            <Text style={adminStyles.dashboard.quickActionIcon}>📊</Text>
            <Text style={adminStyles.dashboard.quickActionText}>Raporlama</Text>
          </TouchableOpacity>
        </View>

        {/* Bekleyen Rezervasyonlar */}
        <View style={adminStyles.dashboard.pendingSection}>
          <View style={adminStyles.dashboard.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>Bekleyen Rezervasyonlar</Text>
            <Text style={adminStyles.dashboard.pendingCount}>({pendingReservations.length})</Text>
          </View>
          
          {pendingReservations.length === 0 ? (
            <View style={globalStyles.emptyState}>
              <Text style={globalStyles.emptyStateText}>Bekleyen rezervasyon bulunmuyor.</Text>
            </View>
          ) : (
            pendingReservations.map((reservation) => (
              <View key={reservation.id} style={adminStyles.dashboard.reservationCard}>
                <View style={adminStyles.dashboard.reservationHeader}>
                  <View>
                    <Text style={adminStyles.dashboard.officeName}>{reservation.offices?.name}</Text>
                    <Text style={adminStyles.dashboard.userInfo}>
                      {reservation.users?.name} • {reservation.users?.specialty}
                    </Text>
                  </View>
                  <View style={adminStyles.dashboard.statusBadge}>
                    <Text style={adminStyles.dashboard.statusText}>Beklemede</Text>
                  </View>
                </View>
                
                <Text style={adminStyles.dashboard.location}>{reservation.offices?.locations?.name}</Text>
                <Text style={adminStyles.dashboard.dateTime}>
                  {formatDate(reservation.start_time)} • {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                </Text>
                
                <View style={adminStyles.dashboard.actions}>
                  <TouchableOpacity 
                    style={adminStyles.dashboard.approveButton}
                    onPress={() => handleApprove(reservation.id)}
                  >
                    <Text style={adminStyles.dashboard.approveButtonText}>✓ Onayla</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={adminStyles.dashboard.rejectButton}
                    onPress={() => handleReject(reservation.id)}
                  >
                    <Text style={adminStyles.dashboard.rejectButtonText}>✗ Reddet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default AdminDashboardScreen;
