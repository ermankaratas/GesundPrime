import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { calendarStyles } from '../styles/calendarStyles';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const CalendarScreen = ({ onNavigate, currentScreen }) => {
  return (
    <View style={globalStyles.container}>
      <Header 
        title="Takvim" 
        onBack={() => onNavigate('home')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        <Text style={globalStyles.sectionTitle}>Takvim Görünümü</Text>
        
        <View style={globalStyles.infoCard}>
          <Text style={globalStyles.infoText}>
            Takvim özelliği yakında eklenecek. Buradan rezervasyonlarınızı takvim formatında görüntüleyebileceksiniz.
          </Text>
        </View>

        <TouchableOpacity 
          style={globalStyles.button.primary}
          onPress={() => onNavigate('my-reservations')}
        >
          <Text style={globalStyles.text.button}>Rezervasyonlarımı Görüntüle</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default CalendarScreen;
