import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import Header from '../components/Header';
import { supabase } from '../services/supabase';

const VerifyResetCodeScreen = ({ onNavigate, params }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = params; // resetToken’i DB’den alacağız, güvenlik amaçlı

  const handleVerify = async () => {
    if (!code) return;

    setLoading(true);
    try {
      const { data: user, error } = await supabase
        .from('gp_users')
        .select('reset_token, reset_token_expiry')
        .eq('email', email)
        .single();

      if (error || !user) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı');
        setLoading(false);
        return;
      }
      const now = new Date().getTime();
      const expiry = new Date(user.reset_token_expiry).getTime();

      console.log("Kullanıcı DB token:", user.reset_token);
      console.log("Girdiğiniz kod:", code);
      console.log("Şu an:", now, "Token expiry:", expiry);

      if (code !== user.reset_token) {
        Alert.alert('Hata', 'Kod yanlış');
      } else if (now > expiry) {
        Alert.alert('Hata', 'Kod süresi dolmuş');
      } else {
        // Kod doğru ve süresi geçmemiş, reset ekranına yönlendir
        onNavigate('reset-password', { email, token: code });
      }

    } catch (err) {
      console.error('Verify code error:', err);
      Alert.alert('Hata', 'Kod doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header title="Kodu Doğrula" onBack={() => onNavigate('forgot-password')} showBack={true} />
      <View style={[globalStyles.content, { justifyContent: 'center' }]}>
        <Text style={[globalStyles.text.title, { textAlign: 'center', marginBottom: 20 }]}>
          Emailine gönderilen 6 haneli kodu gir
        </Text>
        <TextInput
          style={[globalStyles.input, { letterSpacing: 10, textAlign: 'center', fontSize: 24 }]}
          value={code}
          onChangeText={setCode}
          maxLength={6}
          keyboardType="number-pad"
        />
        <TouchableOpacity 
          style={[globalStyles.button.primary, { marginTop: 30 }]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={globalStyles.text.button}>
            {loading ? 'Doğrulanıyor...' : 'Kodu Doğrula'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyResetCodeScreen;
