
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import Header from '../components/Header';

const API_URL = 'http://localhost:3001';

const ResetPasswordScreen = ({ onNavigate, route }) => {
  // Önceki ekrandan gelen email'i alıyoruz.
  const email = route?.params?.email || '';

  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          resetCode: resetCode,
          newPassword: newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Hata', data.message || 'Şifre güncellenemedi. Kodunuz yanlış veya süresi dolmuş olabilir.');
      } else {
        Alert.alert(
          'Başarılı',
          'Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz.',
          [
            {
              text: 'Giriş Yap',
              onPress: () => onNavigate('login'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Şifreyi Yenile" 
        onBack={() => onNavigate('login')} 
        showBack={true} 
      />

      <View style={styles.content}>
        <Text style={[globalStyles.text.title, { textAlign: 'center', marginBottom: 12 }]}>
          Yeni Şifre Belirle
        </Text>
        <Text style={[globalStyles.text.body, { textAlign: 'center', marginBottom: 32 }]}>
          Lütfen size gönderilen sıfırlama kodunu ve yeni şifrenizi girin.
        </Text>

        {/* Email Bilgisi */}
        <Text style={styles.emailInfo}>Sıfırlama yapılan hesap: {email}</Text>

        {/* Alanlar */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sıfırlama Kodu</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="6 haneli kod"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Yeni Şifre</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="En az 6 karakter"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>

        {/* Buton */}
        <TouchableOpacity 
          style={[globalStyles.button.primary, loading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={globalStyles.text.button}>
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
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
  emailInfo: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
    fontWeight: '500',
    color: globalStyles.colors.gray[600],
    backgroundColor: globalStyles.colors.gray[100],
    padding: 10,
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 20,
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
});

export default ResetPasswordScreen;
