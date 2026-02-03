import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const BottomNavigation = ({ onNavigate, currentScreen, showNav = true }) => {
  if (!showNav) return null;

  const navItems = [
    { key: 'home', icon: '🏠', label: 'Ana Sayfa', screen: 'home' },
    { key: 'search', icon: '🔍', label: 'Ara', screen: 'location-select' },
    { key: 'calendar', icon: '🗓️', label: 'Takvim', screen: 'calendar' },
    { key: 'reservations', icon: '📋', label: 'Rezervasyonlarım', screen: 'my-reservations' },
    { key: 'profile', icon: '👤', label: 'Profil', screen: 'profile' },
  ];

  return (
    <View style={globalStyles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={globalStyles.navItem}
          onPress={() => onNavigate(item.screen)}
        >
          <Text style={globalStyles.navIcon}>{item.icon}</Text>
          <Text style={[
            globalStyles.navText,
            currentScreen === item.screen && globalStyles.navTextActive
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigation;
