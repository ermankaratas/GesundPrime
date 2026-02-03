import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../services/supabase';
import { globalStyles } from '../styles/globalStyles';
import { locationStyles } from '../styles/locationStyles';
import BottomNavigation from '../components/BottomNavigation';

const LocationSelectScreen = ({ onNavigate, currentScreen }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // useCallback ile fetchLocations fonksiyonunu sarıyoruz
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gp_locations')
      .select('*, gp_offices(count)')
      .order('name');

    if (!error && data) {
      setLocations(data);
    }
    setLoading(false);
  }, []); // Boş dependency array - sadece bir kere oluştur

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]); // Artık fetchLocations dependency'de

  const handleLocationSelect = (location) => {
    onNavigate('office-list', { location });
  };

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={locationStyles.header}>
        <TouchableOpacity style={locationStyles.backButton} onPress={() => onNavigate('home')}>
          <Text style={locationStyles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={locationStyles.title}>Lokasyon ve Ofis Seçimi</Text>
      </View>

      <Text style={locationStyles.sectionTitle}>Ofis Seç</Text>

      {/* Lokasyon Listesi */}
      <View style={locationStyles.locationsContainer}>
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={locationStyles.locationCard}
            onPress={() => handleLocationSelect(location)}
          >
            <View style={locationStyles.locationInfo}>
              <Text style={locationStyles.locationName}>{location.name}</Text>
              <Text style={locationStyles.officeCount}>{location.gp_offices[0].count} ofis</Text>
            </View>
            <Text style={locationStyles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

    {/* Bottom Navigation */}
    <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default LocationSelectScreen;
