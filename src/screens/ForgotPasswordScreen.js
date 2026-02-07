w
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import Header from '../components/Header';

// Backend API adresimiz
const API_URL = 'http://localhost:3001';

const ForgotPasswordScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // API'den gelen hata mesajını göster
        Alert.alert('Hata', data.message || 'Şifre sıfırlama isteği başarısız oldu.');
      } else {
        // Başarı mesajı göster ve bir sonraki ekrana yönlendir.
        Alert.alert(
          'Başarılı',
          'Eğer e-posta adresiniz sistemimizde kayıtlıysa, şifre sıfırlama talimatları gönderilecektir.',
          [
            {
              text: 'Tamam',
              // Kullanıcıyı, sıfırlama kodunu gireceği ekrana yönlendir
              onPress: () => onNavigate('reset-password', { email: email }),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Şifremi Unuttum" 
        onBack={() => onNavigate('login')}
        showBack={true}
      />

      <View style={[styles.content]}>
        <Text style={[globalStyles.text.title, { textAlign: 'center', marginBottom: 12 }]}>
          Şifreni Sıfırla
        </Text>
        <Text style={[globalStyles.text.body, { textAlign: 'center', marginBottom: 32 }]}>
          Kayıtlı e-posta adresinizi girin. Şifrenizi nasıl sıfırlayacağınıza dair talimatları size göndereceğiz.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-posta Adresi</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="ornek@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <TouchableOpacity 
          style={[globalStyles.button.primary, loading && styles.disabledButton]}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          <Text style={globalStyles.text.button}>
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Kodu Gönder'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('login')}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>
            Giriş Ekranına Dön
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: globalStyles.colors.gray[700],
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: globalStyles.colors.gray[400],
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: globalStyles.colors.primary,
  },
});

export default ForgotPasswordScreen;
