import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../services/supabase';
import { globalStyles } from '../styles/globalStyles';
import { listStyles } from '../styles/listStyles';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const OfficeListScreen = ({ onNavigate, params, currentScreen }) => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = params?.location;

  const fetchOffices = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('gp_offices')
      .select('*')
      .eq('location_id', location.id)
      .order('name');

    if (!error && data) {
      setOffices(data);
    }
    setLoading(false);
  }, [location]);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const handleOfficeSelect = (office) => {
    onNavigate('office-calendar', { office, location });
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title={location?.name || "Ofisler"} 
        onBack={() => onNavigate('location-select')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        <Text style={globalStyles.sectionTitle}>Ofisler</Text>
        
        {offices.map((office) => (
          <View key={office.id} style={listStyles.officeItem}>
            <View style={listStyles.officeInfo}>
              <Text style={listStyles.officeName}>{office.name}</Text>
              <Text style={[
                listStyles.officeStatus,
                office.status === 'available' ? listStyles.statusAvailable : listStyles.statusOccupied
              ]}>
                {office.status === 'available' ? 'Müsait' : 'Dolu'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                listStyles.selectButton,
                office.status !== 'available' && listStyles.selectButtonDisabled
              ]}
              onPress={() => handleOfficeSelect(office)}
              disabled={office.status !== 'available'}
            >
              <Text style={listStyles.selectButtonText}>
                {office.status === 'available' ? 'Seç' : 'Dolu'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default OfficeListScreen;
