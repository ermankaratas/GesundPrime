import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const WelcomeScreen = ({ onNavigate, currentScreen }) => {
  return (
    <View style={globalStyles.container}>
      {/* Header Section */}
      <View style={[globalStyles.header, { alignItems: 'center' }]}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
          Gesund Prime
        </Text>
        <Text style={{ fontSize: 18, color: '#dbeafe' }}>
          Ofis Sistemleri
        </Text>
      </View>

      {/* Main Content */}
      <View style={[globalStyles.content, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={globalStyles.text.title}>
          Gesund Prime Ofis Sistemleri'ne{'\n'}Hoşgeldiniz
        </Text>
        
        <Text style={[globalStyles.text.body, { textAlign: 'center', marginVertical: 30 }]}>
          Rezervasyon Sistemlerini basitleştirmek için{'\n'}kapsamlı ofis çözümlerimizle tanışın.
        </Text>

        <View style={{ width: '100%', height: 1, backgroundColor: '#e5e7eb', marginVertical: 30 }} />

        <TouchableOpacity 
          style={globalStyles.button.primary}
          onPress={() => onNavigate('login')}
        >
          <Text style={globalStyles.text.button}>Başlayın</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ paddingVertical: 20, alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Text style={globalStyles.text.caption}>Gesund Prime Ofis Sistemleri 2025</Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;
