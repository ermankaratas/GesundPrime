import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import BottomNavigation from '../components/BottomNavigation';

const HomeScreen = ({ onNavigate, currentScreen }) => {
  const { user } = useAuth();

  const menuItems = [
    { icon: '🏢', title: 'Ofis Rezervasyon', description: 'Ofis seç ve rezervasyon yap', screen: 'location-select' },
    { icon: '📅', title: 'Rezervasyonlarım', description: 'Rezervasyonlarını yönet', screen: 'my-reservations' },
    { icon: '🗓️', title: 'Takvim', description: 'Takvim görünümü', screen: 'calendar' },
    { icon: '👤', title: 'Profil', description: 'Profil bilgileri', screen: 'profile' },
  ];

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.header}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>
          Gesund Prime Ofis Sistemleri
        </Text>
        <Text style={{ fontSize: 16, color: '#dbeafe' }}>
          Hoş geldiniz, {user?.name}
        </Text>
      </View>

      {/* Menu Grid */}
      <View style={globalStyles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={globalStyles.menuCard}
            onPress={() => onNavigate(item.screen)}
          >
            <Text style={globalStyles.menuIcon}>{item.icon}</Text>
            <Text style={globalStyles.menuTitle}>{item.title}</Text>
            <Text style={globalStyles.menuDescription}>{item.description}</Text>
          </TouchableOpacity>
        ))}

        {/* Admin Paneli Butonu */}
        {user?.role === 'admin' && (
          <TouchableOpacity 
            style={globalStyles.adminCard}
            onPress={() => onNavigate('admin')}
          >
            <Text style={globalStyles.menuIcon}>⚙️</Text>
            <Text style={globalStyles.adminTitle}>Admin Paneli</Text>
            <Text style={globalStyles.adminDescription}>Sistem yönetimi</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default HomeScreen;
