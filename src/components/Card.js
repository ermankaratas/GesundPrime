
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

/**
 * Proje genelinde kullanılabilen, yeniden kullanılabilir bir kart bileşeni.
 * Temel stilini globalStyles'dan alır ve dışarıdan ek stillerle özelleştirilebilir.
 * 
 * @param {object} props - Bileşen prop'ları.
 * @param {React.ReactNode} props.children - Kartın içinde gösterilecek içerik.
 * @param {object} [props.style] - Kartın View bileşenine uygulanacak ek stiller.
 */
const Card = ({ children, style }) => {
  return (
    <View style={[globalStyles.card, style]}>
      {children}
    </View>
  );
};

export default Card;
