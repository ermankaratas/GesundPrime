import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../services/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('Login attempt:', email);
      
      // Supabase'den kullanıcıyı kontrol et
      const { data: users, error } = await supabase
        .from('gp_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true);

      if (error) {
        console.log('Supabase error:', error);
        return { success: false, error: 'Veritabanı hatası' };
      }

      if (!users || users.length === 0) {
        console.log('No user found for email:', email);
        return { success: false, error: 'Kullanıcı bulunamadı' };
      }

      const user = users[0];
      console.log('User found:', user.email);

      // BCRYPT ile şifre kontrolü
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        setUser(user);
        return { success: true, user: user };
      } else {
        console.log('Password mismatch');
        return { success: false, error: 'Geçersiz şifre' };
      }

    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Giriş başarısız: ' + error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
