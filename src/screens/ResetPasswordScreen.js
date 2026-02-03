import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import Header from '../components/Header';
import { supabase } from '../services/supabase';
import { hashPassword } from '../utils/hashGenerator';

const ResetPasswordScreen = ({ onNavigate, params }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const { email, token } = params;

  useEffect(() => {
    if (email && token) {
      checkToken(email, token);
    }
  }, [email, token]);

  const checkToken = async (email, token) => {
    try {
      const { data: user, error } = await supabase
        .from('gp_users')
        .select('reset_token, reset_token_expiry')
        .eq('email', email)
        .single();

      if (error || !user) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı');
        console.log("Token check DB error:", error);
        setTokenValid(false);
        return;
      }

      const now = new Date().getTime();
      const expiry = new Date(user.reset_token_expiry).getTime();

      console.log("Token DB:", user.reset_token, "Gelen token:", token, "Expiry:", expiry);

      if (token !== user.reset_token) {
        Alert.alert('Hata', 'Kod yanlış veya süresi dolmuş');
        setTokenValid(false);
      } else if (now > expiry) {
        Alert.alert('Hata', 'Kod süresi dolmuş');
        setTokenValid(false);
      }else {
        setTokenValid(true);
      }
    } catch (err){
      console.error("Token validation error:", err);
      setTokenValid(false);
      Alert.alert('Hata', 'Token doğrulama başarısız');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = await hashPassword(newPassword);

      const { data, error } = await supabase
        .from('gp_users')
        .update({
          password: hashedPassword,
          reset_token: null,
          reset_token_expiry: null
        })
        .eq('email', email)
        .eq('reset_token', String(token))
        .select();

      console.log("Update result:", data, "Update error:", error);

      if (error) throw error;

      Alert.alert(
        'Başarılı', 
        'Şifreniz başarıyla güncellendi.',
        [{ text: 'Tamam', onPress: () => onNavigate('login') }]
      );

    } catch (err) {
      console.error("Password update error:", err);
      Alert.alert('Hata', 'Şifre güncelleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <View style={globalStyles.container}>
        <Header title="Şifre Sıfırlama" showBack={true} onBack={() => onNavigate('login')} />
        <View style={[globalStyles.content, { justifyContent: 'center' }]}>
          <Text style={globalStyles.text.body}>Token geçersiz veya süresi dolmuş</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header title="Yeni Şifre Belirle" showBack={true} onBack={() => onNavigate('login')} />
      
      <View style={[globalStyles.content, { justifyContent: 'center' }]}>
        <Text style={[globalStyles.text.title, { textAlign: 'center', marginBottom: 40 }]}>
          Yeni Şifrenizi Belirleyin
        </Text>

        <View style={{ marginBottom: 40 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={[globalStyles.text.subtitle, { marginBottom: 8 }]}>Yeni Şifre</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Yeni şifrenizi girin"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={[globalStyles.text.subtitle, { marginBottom: 8 }]}>Şifre Tekrar</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Şifrenizi tekrar girin"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[globalStyles.button.primary, loading && { backgroundColor: '#9ca3af' }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={globalStyles.text.button}>
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
