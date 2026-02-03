import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const Header = ({ title, onBack, showBack = true }) => {
  return (
    <View style={globalStyles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={{ marginRight: 15 }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>← Geri</Text>
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default Header;
