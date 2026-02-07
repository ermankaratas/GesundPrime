
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import Header from '../components/Header';

const LoginScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      // Başarılı girişte ana ekrana yönlendirme App.js'de yönetilecek
      // Bu component artık doğrudan yönlendirme yapmamalı
    } else {
      Alert.alert('Giriş Başarısız', result.error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Giriş Yap" 
        onBack={() => onNavigate('welcome')}
        showBack={true}
      />

      <View style={[globalStyles.content, { justifyContent: 'center' }]}>
        <Text style={[globalStyles.text.title, { textAlign: 'center', marginBottom: 8 }]}>
          Tekrar hoşgeldiniz
        </Text>
        <Text style={[globalStyles.text.body, { textAlign: 'center', marginBottom: 40 }]}>
          Hesabınıza giriş yapın
        </Text>

        {/* Form */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={[globalStyles.text.subtitle, { marginBottom: 8 }]}>Kullanıcı Adı</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="E-posta adresinizi girin"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={[globalStyles.text.subtitle, { marginBottom: 8 }]}>Şifre</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Şifrenizi girin"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[globalStyles.button.primary, loading && { backgroundColor: '#9ca3af' }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={globalStyles.text.button}>
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ alignItems: 'center', padding: 16 }}
            onPress={() => onNavigate('forgot-password')}  
          >
            <Text style={{ color: '#2563eb', fontSize: 14, fontWeight: '500' }}>
              Şifremi Unuttum
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer: Kayıt Ekranına Yönlendirme */}
        <View style={{ alignItems: 'center' }}>
           <TouchableOpacity 
            style={{ alignItems: 'center', padding: 16 }}
            onPress={() => onNavigate('register')} // Yeni eklenen yönlendirme
          >
            <Text style={globalStyles.text.body}>
              Hesabınız yok mu? <Text style={{ color: '#2563eb', fontWeight: '600' }}>Hesap Oluştur</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
