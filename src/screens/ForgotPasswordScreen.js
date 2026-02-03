import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import Header from '../components/Header';
import { supabase } from '../services/supabase';
import { generateResetCode } from '../utils/hashGenerator';
import { sendPasswordResetEmail } from '../services/emailService';

const ForgotPasswordScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen email adresinizi girin');
      return;
    }

    setLoading(true);
    try {
      // 1. Kullanıcıyı kontrol et
      const { data: user, error: userError } = await supabase
        .from('gp_users')
        .select('id, email, name')
        .eq('email', email)
        .single();

      if (userError || !user) {
        Alert.alert('Hata', 'Bu email adresi ile kayıtlı kullanıcı bulunamadı');
        setLoading(false);
        return;
      }

      // 2. Token oluştur
      const resetToken = generateResetCode();
      const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

      // 3. Token'ı veritabanına kaydet
      const { data: updatedUser, error: updateError } = await supabase
        .from('gp_users')
        .update({
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry.toISOString()
        })
        .eq('id', user.id)
        .select();

      if (updateError) {
        console.error('Token update error:', updateError);
        throw updateError;
      } else {
        console.log('Token güncellendi:', updatedUser);
      }

      // 4. Email gönder
      const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);

      if (emailResult.success) {
        // Başarılıysa şifre sıfırlama ekranına yönlendir
        onNavigate('verify-reset-code', { 
          email: user.email,
        }); 
        }else {
          Alert.alert('Hata', 'Email gönderilemedi. Lütfen tekrar deneyin.');
      }

    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
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

      <View style={[globalStyles.content, { justifyContent: 'center' }]}>
        <Text style={[globalStyles.text.title, { textAlign: 'center', marginBottom: 8 }]}>
          Şifre Sıfırlama
        </Text>
        <Text style={[globalStyles.text.body, { textAlign: 'center', marginBottom: 40 }]}>
          Email adresinizi girerek şifre sıfırlama kodu alabilirsiniz
        </Text>

        <View style={{ marginBottom: 40 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={[globalStyles.text.subtitle, { marginBottom: 8 }]}>Email Adresi</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Email adresinizi girin"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[globalStyles.button.primary, loading && { backgroundColor: '#9ca3af' }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={globalStyles.text.button}>
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ alignItems: 'center', padding: 16 }}
            onPress={() => onNavigate('login')}
          >
            <Text style={{ color: '#2563eb', fontSize: 14, fontWeight: '500' }}>
              Giriş Sayfasına Dön
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
