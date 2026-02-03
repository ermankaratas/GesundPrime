import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import { profileStyles } from '../styles/profileStyles';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const ProfileScreen = ({ onNavigate, currentScreen }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('welcome');
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Profil" 
        onBack={() => onNavigate('home')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        {/* Profil Bilgileri */}
        <View style={profileStyles.profileCard}>
          <View style={profileStyles.avatar}>
            <Text style={profileStyles.avatarText}>
              {user?.name?.charAt(0) || 'K'}
            </Text>
          </View>
          
          <Text style={profileStyles.userName}>{user?.name || 'Kullanıcı'}</Text>
          <Text style={profileStyles.userEmail}>{user?.email || 'email@example.com'}</Text>
          <Text style={profileStyles.userRole}>
            {user?.role === 'admin' ? 'Yönetici' : user?.role === 'doctor' ? 'Doktor' : 'Asistan'}
          </Text>
          
          {user?.specialty && (
            <Text style={profileStyles.userSpecialty}>{user.specialty}</Text>
          )}
        </View>

        {/* İstatistikler */}
        <View style={profileStyles.statsContainer}>
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statNumber}>0</Text>
            <Text style={profileStyles.statLabel}>Toplam Rezervasyon</Text>
          </View>
          
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statNumber}>0</Text>
            <Text style={profileStyles.statLabel}>Aktif</Text>
          </View>
          
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statNumber}>0</Text>
            <Text style={profileStyles.statLabel}>Geçmiş</Text>
          </View>
        </View>

        {/* Çıkış Butonu */}
        <TouchableOpacity style={profileStyles.logoutButton} onPress={handleLogout}>
          <Text style={profileStyles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default ProfileScreen;
