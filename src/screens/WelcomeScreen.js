
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const WelcomeScreen = ({ onNavigate }) => {
  return (
    <View style={globalStyles.container}>
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80' }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Content & Actions Section */}
      <View style={styles.contentContainer}>
        <Text style={[globalStyles.text.title, styles.title]}>
          Gesund Prime Ofis Sistemleri'ne Hoş Geldiniz
        </Text>
        
        <Text style={[globalStyles.text.body, styles.subtitle]}>
          Ofis rezervasyon süreçlerinizi kolayca yönetin ve verimliliği artırın.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[globalStyles.button.primary, { marginBottom: 16 }]} // Butonlar arası boşluk için inline stil kabul edilebilir
            onPress={() => onNavigate('login')}
          >
            <Text style={globalStyles.text.button}>Giriş Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.button.secondary}
            onPress={() => onNavigate('register')}
          >
            <Text style={globalStyles.text.buttonSecondary}>Hesap Oluştur</Text>
          </TouchableOpacity>
        </View>

        <Text style={[globalStyles.text.caption, styles.footerText]}>
          Gesund Prime © 2025
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1.2, 
    backgroundColor: globalStyles.colors.primaryLight, // globalStyles kullanıldı
  },
  image: {
    width: '100%', 
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: globalStyles.colors.white, // globalStyles kullanıldı
    marginTop: -30, // Üst üste binme efekti için korundu, ancak bilinçli bir karar
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
  },
});

export default WelcomeScreen;
